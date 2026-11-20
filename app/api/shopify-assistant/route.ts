// ─────────────────────────────────────────────────────────────────────────────
// app/api/shopify-assistant/route.ts
// Backend for the "Ask LP's AI" chat on the Shopify site (louispoloworld.com).
// The widget lives in the Shopify theme (snippets/lp-assistant.liquid); this
// route holds the Gemini key and the tool loop, like /api/assistant does for
// the Next.js site, but answers from the live Shopify catalog and policies.
//
//   GET     warm-up: loads the catalog/policies cache, no model call
//   POST    { messages: [{ role: 'user' | 'assistant', content }] }
//           → newline-delimited JSON: {"t":"text","v":"..."} | {"t":"error","v":"..."} | {"t":"done"}
//   OPTIONS CORS preflight
//
// Only the Shopify storefront origins may call it (SHOPIFY_ASSISTANT_ORIGINS,
// comma-separated, overrides the defaults; local theme preview is allowed in
// development). Shares the per-visitor and daily limits with /api/assistant,
// since both spend the same Gemini quota.
//
// Env: GEMINI_API_KEY (required), SHOPIFY_ASSISTANT_MODEL, SHOPIFY_STORE_URL,
//      SHOPIFY_ASSISTANT_ORIGINS, ASSISTANT_DAILY_LIMIT (all optional).
// ─────────────────────────────────────────────────────────────────────────────

import {
  FunctionCallingConfigMode,
  GoogleGenAI,
  type Content,
  type FunctionCall,
  type FunctionDeclaration,
  type Part,
} from '@google/genai'
import { BRAND } from '@/lib/constants'
import { checkLimit } from '@/lib/assistant/rateLimit'
import { getProducts, getPolicies } from '@/lib/shopify-assistant/store'
import { getProductDetails } from '@/lib/shopify-assistant/catalog'
import { getSystemPrompt } from '@/lib/shopify-assistant/prompt'
import { createLinkGuard } from '@/lib/shopify-assistant/links'

export const runtime     = 'nodejs'
export const dynamic     = 'force-dynamic'
export const maxDuration = 30

// gemini-3.1-flash-lite answered ~4x faster than gemini-3.5-flash-lite on the free
// tier in testing (2.4 s vs 9.6 s for the same 4-sentence reply). Separate from
// GEMINI_MODEL so the Next.js assistant keeps its own model.
const MODEL           = process.env.SHOPIFY_ASSISTANT_MODEL || 'gemini-3.1-flash-lite'
const MAX_MESSAGES    = 12
const MAX_CHARS       = 800
const MAX_BODY_CHARS  = 20_000
// One round of tool calls, then a forced text answer: at most 2 model calls per
// message, so the shared daily cap (200 messages) stays inside the free quota.
const MAX_TOOL_ROUNDS = 1

const TOOLS: FunctionDeclaration[] = [
  {
    name: 'get_product_details',
    description:
      'Get full details for 1 to 3 LOUIS POLO products: description, features, specifications, warranty, care, and price and availability for every option. Use it for any question beyond the catalog line, and to compare products.',
    parametersJsonSchema: {
      type: 'object',
      properties: {
        handles: {
          type: 'array',
          items: { type: 'string' },
          minItems: 1,
          maxItems: 3,
          description: 'Product paths exactly as written in the catalog, e.g. "/products/louis-polo-aerox-lightweight-20-hard-shell-cabin-trolley".',
        },
      },
      required: ['handles'],
    },
  },
]

const MSG_BUSY     = `The assistant is very busy right now. Please try again in a minute, or message us on WhatsApp: ${BRAND.whatsapp}`
const MSG_FAILED   = `Sorry, I could not answer that just now. Please try again, or reach us on WhatsApp: ${BRAND.whatsapp}`
const MSG_NO_REPLY = `I could not put a good answer together for that. Please rephrase, or ask our team on WhatsApp: ${BRAND.whatsapp}`

// ── CORS ──────────────────────────────────────────────────────────────────────

const DEFAULT_ORIGINS = [
  'https://louispoloworld.com',
  'https://www.louispoloworld.com',
  'https://cyqpsc-j0.myshopify.com',
]
const DEV_ORIGINS = ['http://127.0.0.1:9292', 'http://localhost:9292']

function allowedOrigins(): Set<string> {
  const env  = process.env.SHOPIFY_ASSISTANT_ORIGINS
  const list = env ? env.split(',').map((s) => s.trim()).filter(Boolean) : DEFAULT_ORIGINS
  return new Set(process.env.NODE_ENV === 'production' ? list : [...list, ...DEV_ORIGINS])
}

function cors(origin: string | null): Record<string, string> {
  if (!origin || !allowedOrigins().has(origin)) return { Vary: 'Origin' }
  return {
    'Access-Control-Allow-Origin':  origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age':       '86400',
    Vary:                           'Origin',
  }
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors(origin) },
  })
}

// ── Request parsing (same rules as /api/assistant) ─────────────────────────────

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
    const last = out[out.length - 1]
    if (last && last.role === role) last.content += '\n' + text
    else out.push({ role, content: text })
  }
  while (out.length && out[0].role !== 'user') out.shift()
  if (!out.length || out[out.length - 1].role !== 'user') return null
  return out
}

function isBusyError(e: unknown): boolean {
  const status = (e as { status?: number })?.status
  const msg    = e instanceof Error ? e.message : String(e)
  return status === 429 || status === 503 || /RESOURCE_EXHAUSTED|UNAVAILABLE|high demand|quota|rate.?limit/i.test(msg)
}

function isOverloaded(e: unknown): boolean {
  const status = (e as { status?: number })?.status
  const msg    = e instanceof Error ? e.message : String(e)
  return status === 503 || /UNAVAILABLE|high demand/i.test(msg)
}

const RETRY_DELAYS_MS = [1200, 2500]

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
      console.warn(`[shopify-assistant] model overloaded, retry ${attempt + 1}/${RETRY_DELAYS_MS.length}`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAYS_MS[attempt]))
    }
  }
}

// ── Handlers ──────────────────────────────────────────────────────────────────

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get('origin')) })
}

/** Warm-up: the widget calls this when the chat is about to open, so the first answer is fast. */
export async function GET(request: Request) {
  const origin = request.headers.get('origin')
  try {
    const [products] = await Promise.all([getProducts(), getPolicies()])
    return json({ ok: true, products: products.length }, 200, origin)
  } catch {
    return json({ ok: false }, 503, origin)
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!origin || !allowedOrigins().has(origin)) return json({ error: 'Forbidden' }, 403, origin)

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return json({ error: 'The assistant is not set up yet.' }, 503, origin)

  // The widget sends JSON as text/plain, which skips the CORS preflight round trip.
  let body: unknown
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_CHARS) return json({ error: 'Invalid request' }, 413, origin)
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'Invalid request' }, 400, origin)
  }
  const messages = parseMessages(body)
  if (!messages) return json({ error: 'Invalid request' }, 400, origin)

  const visitor = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
  if (!checkLimit(visitor).ok) return json({ error: MSG_BUSY }, 429, origin)

  let products: Awaited<ReturnType<typeof getProducts>>
  let systemPrompt: string
  try {
    const [p, policies] = await Promise.all([getProducts(), getPolicies()])
    products = p
    systemPrompt = getSystemPrompt(p, policies)
  } catch (e) {
    console.error('[shopify-assistant] store data unavailable:', e instanceof Error ? e.message : e)
    return json({ error: MSG_FAILED }, 503, origin)
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
      const guard = createLinkGuard(products)
      const emit  = (text: string) => {
        if (!text) return
        sentText = true
        send({ t: 'text', v: text })
      }

      try {
        for (let round = 0; round <= MAX_TOOL_ROUNDS; round++) {
          const lastRound = round === MAX_TOOL_ROUNDS
          const response = await startStream(ai, {
            model: MODEL,
            contents,
            config: {
              systemInstruction: systemPrompt,
              tools:             [{ functionDeclarations: TOOLS }],
              // On the last round the model must answer in text, not call another tool.
              ...(lastRound && { toolConfig: { functionCallingConfig: { mode: FunctionCallingConfigMode.NONE } } }),
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

          if (calls.length === 0 || lastRound) break

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
                      ? getProductDetails(products, (call.args as { handles?: unknown } | undefined)?.handles)
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
        if (!request.signal.aborted) {
          console.error('[shopify-assistant] request failed:', e instanceof Error ? e.message : e)
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
      ...cors(origin),
    },
  })
}
