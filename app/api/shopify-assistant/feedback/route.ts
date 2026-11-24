// ─────────────────────────────────────────────────────────────────────────────
// app/api/shopify-assistant/feedback/route.ts
// 👍/👎 votes on the Shopify chat's answers, saved to the assistant_feedback
// table in Supabase (supabase/migrations/20261124_assistant_feedback.sql).
//
//   POST    { id, vote: 'up' | 'down', question, answer, page? }  → 204
//   OPTIONS CORS preflight
//
// `id` is the answer's id from the widget: voting again on the same answer
// changes the vote instead of adding a row. Saving is best-effort; the shopper
// sees "thanks" either way.
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceRoleClient } from '@/lib/supabase/server'
import { cors, isAllowedOrigin, json } from '@/lib/shopify-assistant/cors'
import { pickProvider } from '@/lib/shopify-assistant/providers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_CHARS = 8_000

function text(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: cors(request.headers.get('origin')) })
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (!isAllowedOrigin(origin)) return json({ error: 'Forbidden' }, 403, origin)

  // Sent as text/plain, like the chat, to skip the CORS preflight.
  let body: Record<string, unknown>
  try {
    const raw = await request.text()
    if (raw.length > MAX_BODY_CHARS) return json({ error: 'Invalid request' }, 413, origin)
    body = JSON.parse(raw)
  } catch {
    return json({ error: 'Invalid request' }, 400, origin)
  }

  const id       = text(body?.id, 64)
  const vote     = body?.vote
  const question = text(body?.question, 800)
  const answer   = text(body?.answer, 4000)
  const page     = text(body?.page, 300)
  if (!/^[a-z0-9-]{6,64}$/i.test(id) || (vote !== 'up' && vote !== 'down') || !answer) {
    return json({ error: 'Invalid request' }, 400, origin)
  }

  const provider = pickProvider()
  const { error } = await createServiceRoleClient()
    .from('assistant_feedback')
    .upsert(
      { answer_id: id, vote, question, answer, page: page || null, model: provider ? `${provider.name}:${provider.model}` : null },
      { onConflict: 'answer_id' },
    )
  if (error) console.error('[shopify-assistant] failed to save feedback:', error.message)

  return new Response(null, { status: 204, headers: cors(origin) })
}
