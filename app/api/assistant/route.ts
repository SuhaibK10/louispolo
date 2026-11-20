// ─────────────────────────────────────────────────────────────────────────────
// app/api/assistant/route.ts
// POST /api/assistant  { messages: [{ role: 'user' | 'assistant', content }] }
//
// Streams the shopping assistant's reply as newline-delimited JSON:
//   {"t":"text","v":"..."}   a piece of the answer
//   {"t":"error","v":"..."}  a customer-safe error message
//   {"t":"done"}             end of reply
//
// The Gemini key stays on the server. The client only ever sends plain text
// turns; the tool loop (get_product_details) runs entirely here.
//
// Env: GEMINI_API_KEY (required), GEMINI_MODEL (optional),
//      ASSISTANT_DAILY_LIMIT (optional), see lib/assistant/rateLimit.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server'
import {
  GoogleGenAI,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
  type Part,
} from '@google/genai'
import { BRAND } from '@/lib/constants'
import { getSystemPrompt } from '@/lib/assistant/prompt'
import { getProductDetails } from '@/lib/assistant/catalog'
import { checkLimit } from '@/lib/assistant/rateLimit'
import { createLinkGuard } from '@/lib/assistant/links'

export const runtime     = 'nodejs'
export const dynamic     = 'force-dynamic'
export const maxDuration = 30

const MODEL           = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite'
const MAX_MESSAGES    = 12   // turns of history accepted from the browser
const MAX_CHARS       = 800  // per message
const MAX_TOOL_ROUNDS = 2    // extra model calls after tool results

const TOOLS: FunctionDeclaration[] = [
  {
    name: 'get_product_details',
    description:
      'Get full details for 1 to 3 Louis Polo products: description, features, specifications, warranty, FAQs, and price and availability for every colour and size. Use it for any question beyond the catalog line, and to compare products.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        slugs: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 3,
          description: 'Product slugs exactly as written in the catalog, e.g. "griptrunk".',
        },
      },
      required: ['slugs'],
    },
  },
]

const MSG_BUSY     = `The assistant is very busy right now. Please try again in a minute, or message us on WhatsApp: ${BRAND.whatsapp}`
const MSG_FAILED   = `Sorry, I could not answer that just now. Please try again, or reach us on WhatsApp: ${BRAND.whatsapp}`
const MSG_NO_REPLY = `I could not put a good answer together for that. Please rephrase, or ask our team on WhatsApp: ${BRAND.whatsapp}`

type ClientMessage = { role: 'user' | 'assistant'; content: string }

function parseMessages(body: unknown): ClientMessage[] | null {
  if (!body || typeof body !== 'object') return null
  const raw = (body as { messages?: unknown }).messages
  if (!Array.isArray(raw) || raw.length === 0) return null

  const out: ClientMessage[] = []
  for (const m of raw.slice(-MAX_MESSAGES)) {
    if (!m || typeof m !== 'object') return null
    const { role, content } = m as { role?: unknown; content?: unknown }
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    const text = content.trim().slice(0, MAX_CHARS)
    if (!text) continue
    // Gemini wants strictly alternating turns, so merge same-role neighbours
    // (happens when the browser drops a failed reply from the history).
    const last = out[out.length - 1]
    if (last && last.role === role) last.content += '\n' + text
    else out.push({ role, content: text })
  }
  // Gemini needs the conversation to start with, and end on, a user turn.
  while (out.length && out[0].role !== 'user') out.shift()
  if (!out.length || out[out.length - 1].role !== 'user') return null
  return out
}

/** Google is out of quota (429) or temporarily overloaded (503 "high demand"). */
function isBusyError(e: unknown): boolean {
  const status = (e as { status?: number })?.status
  const msg    = e instanceof Error ? e.message : String(e)
  return (
    status === 429 || status === 503 ||
    /RESOURCE_EXHAUSTED|UNAVAILABLE|high demand|quota|rate.?limit/i.test(msg)
  )
}

/** Only overload errors are worth retrying; a quota (429) will not clear in seconds. */
function isOverloaded(e: unknown): boolean {
  const status = (e as { status?: number })?.status
  const msg    = e instanceof Error ? e.message : String(e)
  return status === 503 || /UNAVAILABLE|high demand/i.test(msg)
}

const RETRY_DELAYS_MS = [1200, 2500]

/**
 * Starts a model call, retrying briefly when Google reports it is overloaded.
 * The free tier hits these "high demand" 503s regularly; a retry usually works.
 * Only the start of the call is retried, so no text can be sent twice.
 */
async function startStream(
  ai: GoogleGenAI,
  params: Parameters<GoogleGenAI['models']['generateContentStream']>[0],
  signal: AbortSignal,
) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await ai.models.generateContentStream(params)
    } catch (e) {
      if (signal.aborted || !isOverloaded(e) || attempt >= RETRY_DELAYS_MS.length) throw e
      console.warn(`[assistant] model overloaded, retry ${attempt + 1}/${RETRY_DELAYS_MS.length}`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
    }
  }
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'The assistant is not set up yet.' }, { status: 503 })
  }

  // Browsers always send Origin on a cross-site POST. Refuse other websites
  // calling this endpoint from their pages and spending our quota.
  const origin = request.headers.get('origin')
  if (origin) {
    let sameSite = false
    try { sameSite = new URL(origin).host === request.headers.get('host') } catch { /* bad origin */ }
    if (!sameSite) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: unknown
  try { body = await request.json() } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const messages = parseMessages(body)
  if (!messages) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const visitor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  const limit   = checkLimit(visitor)
  if (!limit.ok) {
    return NextResponse.json({ error: MSG_BUSY }, { status: 429 })
  }

  const ai = new GoogleGenAI({ apiKey })
  const contents: Content[] = messages.map((m) => ({
    role:  m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }))

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: { t: 'text' | 'error'; v: string } | { t: 'done' }) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))

      let sentText = false
      const guard  = createLinkGuard()
      const emit   = (text: string) => {
        if (!text) return
        sentText = true
        send({ t: 'text', v: text })
      }

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const response = await startStream(ai, {
            model: MODEL,
            contents,
            config: {
              systemInstruction: getSystemPrompt(),
              tools:             [{ functionDeclarations: TOOLS }],
              maxOutputTokens:   1024,
              abortSignal:       request.signal,
            },
          }, request.signal)

          const modelParts: Part[]        = []
          const calls:      FunctionCall[] = []

          for await (const chunk of response) {
            for (const part of chunk.candidates?.[0]?.content?.parts ?? []) {
              modelParts.push(part)
              if (part.functionCall) calls.push(part.functionCall)
              else if (typeof part.text === 'string' && !part.thought && part.text) {
                emit(guard.push(part.text))
              }
            }
          }

          if (calls.length === 0 || round === MAX_TOOL_ROUNDS) break

          // Run the tool(s) and hand the results back for the next round. The
          // model's own parts go back unchanged (Gemini 3 needs its thought
          // signatures echoed with function calls).
          contents.push({ role: 'model', parts: modelParts })
          contents.push({
            role:  'user',
            parts: calls.map((call): Part => ({
              functionResponse: {
                id:       call.id,
                name:     call.name,
                response: {
                  output:
                    call.name === 'get_product_details'
                      ? getProductDetails((call.args as { slugs?: unknown } | undefined)?.slugs)
                      : { error: `Unknown tool ${call.name}` },
                },
              },
            })),
          })
        }

        emit(guard.flush())
        if (!sentText) send({ t: 'text', v: MSG_NO_REPLY })
        send({ t: 'done' })
      } catch (e) {
        if (request.signal.aborted) {
          // Visitor closed the chat mid-answer. Nothing to report.
        } else {
          console.error('[assistant] request failed:', e instanceof Error ? e.message : e)
          emit(guard.flush())
          send({ t: 'error', v: isBusyError(e) ? MSG_BUSY : MSG_FAILED })
          send({ t: 'done' })
        }
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type':  'application/x-ndjson; charset=utf-8',
      'Cache-Control': 'no-store, no-transform',
    },
  })
}
