// ─────────────────────────────────────────────────────────────────────────────
// app/api/shopify-assistant/route.ts
// Backend for the "Ask LP's AI" chat on the Shopify site (louispoloworld.com).
// The widget lives in the Shopify theme (snippets/lp-assistant.liquid); this
// route holds the AI key and the tool loop, like /api/assistant does for the
// Next.js site, but answers from the live Shopify catalog and policies.
//
//   GET     warm-up: loads the catalog/policies cache, no model call
//   POST    { messages: [{ role: 'user' | 'assistant', content }] }
//           → newline-delimited JSON: {"t":"text","v":"..."} | {"t":"suggest","v":["..."]}
//             | {"t":"error","v":"..."} | {"t":"done"}
//           "suggest" carries 2-3 follow-up questions for tap-to-ask buttons.
//   OPTIONS CORS preflight
//
// 👍/👎 votes on answers go to ./feedback/route.ts.
//
// Only the Shopify storefront origins may call it (SHOPIFY_ASSISTANT_ORIGINS,
// comma-separated, overrides the defaults; local theme preview is allowed in
// development). Shares the per-visitor and daily limits with /api/assistant,
// which also cap how much the AI provider can spend.
//
// AI provider: OpenRouter or Gemini, chosen by SHOPIFY_ASSISTANT_PROVIDER.
// See lib/shopify-assistant/providers/index.ts for the keys and model settings.
// Other env (optional): SHOPIFY_STORE_URL, SHOPIFY_ASSISTANT_ORIGINS, ASSISTANT_DAILY_LIMIT.
// ─────────────────────────────────────────────────────────────────────────────

import { BRAND } from '@/lib/constants'
import { checkLimit } from '@/lib/assistant/rateLimit'
import { getProducts, getPolicies } from '@/lib/shopify-assistant/store'
import { getProductDetails } from '@/lib/shopify-assistant/catalog'
import { getSystemPrompt } from '@/lib/shopify-assistant/prompt'
import { createLinkGuard } from '@/lib/shopify-assistant/links'
import { createSuggestionSplitter } from '@/lib/shopify-assistant/suggestions'
import { cors, isAllowedOrigin, json } from '@/lib/shopify-assistant/cors'
import { isBusyError, pickProvider, type ChatMessage } from '@/lib/shopify-assistant/providers'

export const runtime     = 'nodejs'
export const dynamic     = 'force-dynamic'
export const maxDuration = 30

const MAX_MESSAGES    = 12
const MAX_CHARS       = 800
const MAX_BODY_CHARS  = 20_000

const MSG_BUSY     = `The assistant is very busy right now. Please try again in a minute, or message us on WhatsApp: ${BRAND.whatsapp}`
const MSG_FAILED   = `Sorry, I could not answer that just now. Please try again, or reach us on WhatsApp: ${BRAND.whatsapp}`
const MSG_NO_REPLY = `I could not put a good answer together for that. Please rephrase, or ask our team on WhatsApp: ${BRAND.whatsapp}`

// ── Request parsing (same rules as /api/assistant) ─────────────────────────────

function parseMessages(body: unknown): ChatMessage[] | null {
  if (!body || typeof body !== 'object') return null
  const raw = (body as { messages?: unknown }).messages
  if (!Array.isArray(raw) || raw.length === 0) return null

  const out: ChatMessage[] = []
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

// ── Handlers ──────────────────────────────────────────────────────────────────

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get('origin')) })
}

/** Warm-up: the widget calls this when the chat is about to open, so the first answer is fast. */
export async function GET(request: Request) {
  const origin = request.headers.get('origin')
  try {
    const [products] = await Promise.all([getProducts(), getPolicies()])
    return json({ ok: true, products: products.length, provider: pickProvider()?.name ?? null }, 200, origin)
  } catch {
    return json({ ok: false }, 503, origin)
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) return json({ error: 'Forbidden' }, 403, origin)

  const provider = pickProvider()
  if (!provider) return json({ error: 'The assistant is not set up yet.' }, 503, origin)

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

  const encoder = new TextEncoder()
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: { t: 'text' | 'error'; v: string } | { t: 'suggest'; v: string[] } | { t: 'done' }) =>
        controller.enqueue(encoder.encode(JSON.stringify(event) + '\n'))

      let sentText = false
      const guard    = createLinkGuard(products)
      const splitter = createSuggestionSplitter()
      const emit  = (text: string) => {
        if (!text) return
        sentText = true
        send({ t: 'text', v: text })
      }

      try {
        await provider.answer({
          systemPrompt,
          messages,
          signal:  request.signal,
          onText:  (text) => emit(guard.push(splitter.push(text))),
          runTool: (name, args) =>
            name === 'get_product_details'
              ? getProductDetails(products, (args as { handles?: unknown } | undefined)?.handles)
              : { error: `Unknown tool ${name}` },
        })

        emit(guard.push(splitter.flush()))
        emit(guard.flush())
        if (!sentText) send({ t: 'text', v: MSG_NO_REPLY })
        else {
          const suggestions = splitter.suggestions()
          if (suggestions.length) send({ t: 'suggest', v: suggestions })
        }
        send({ t: 'done' })
      } catch (e) {
        if (!request.signal.aborted) {
          console.error(`[shopify-assistant] ${provider.name} (${provider.model}) request failed:`, e instanceof Error ? e.message : e)
          emit(guard.push(splitter.flush()))
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
