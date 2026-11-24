// ─────────────────────────────────────────────────────────────────────────────
// app/api/shopify-assistant/lead/route.ts
// Phone numbers from the Shopify chat: after a few questions the widget asks
// the shopper for their number before continuing, and sends it here. Saved to
// the assistant_leads table in Supabase
// (supabase/migrations/20261124_assistant_leads.sql) so the team can follow up.
//
//   POST    { phone, questions?, page? }  → 204
//   OPTIONS CORS preflight
//
// Saving is best-effort, like spin-to-win entries: the shopper can carry on
// chatting either way.
// ─────────────────────────────────────────────────────────────────────────────

import { createServiceRoleClient } from '@/lib/supabase/server'
import { cors, isAllowedOrigin, json } from '@/lib/shopify-assistant/cors'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BODY_CHARS = 6_000

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

  // Indian mobile number: 10 digits starting 6-9, with or without +91 / 0.
  const digits = text(body?.phone, 20).replace(/\D/g, '').replace(/^(?:91|0)(?=\d{10}$)/, '')
  if (!/^[6-9]\d{9}$/.test(digits)) return json({ error: 'Enter a valid 10-digit mobile number.' }, 400, origin)

  const { error } = await createServiceRoleClient().from('assistant_leads').insert({
    phone:     `+91${digits}`,
    questions: text(body?.questions, 2000),
    page:      text(body?.page, 300) || null,
  })
  if (error) console.error('[shopify-assistant] failed to save lead:', error.message)

  return new Response(null, { status: 204, headers: cors(origin) })
}
