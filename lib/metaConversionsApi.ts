// ─────────────────────────────────────────────────────────────────────────────
// lib/metaConversionsApi.ts
// Server-side counterpart to lib/metaPixel.ts. Sends the same purchase event
// directly to Meta from our server, so it still gets counted when the
// browser-side pixel is blocked (Safari/iOS tracking protection, ad blockers,
// a slow/failed script load). Never blocks the checkout response — callers
// should fire this and .catch() it, the same way order emails are sent in
// app/api/checkout/verify/route.ts.
// ─────────────────────────────────────────────────────────────────────────────

import crypto from 'crypto'

const PIXEL_ID      = process.env.NEXT_PUBLIC_META_PIXEL_ID
const ACCESS_TOKEN   = process.env.META_CONVERSIONS_API_ACCESS_TOKEN
const GRAPH_VERSION  = 'v21.0'

// Meta requires PII hashed with SHA-256, lowercased/trimmed first (email) or
// digits-only (phone) — an unhashed or wrongly-normalized value just fails
// to match silently, it won't error, so this normalization is load-bearing.
const sha256 = (value: string) => crypto.createHash('sha256').update(value).digest('hex')

const hashEmail = (email: string) => sha256(email.trim().toLowerCase())

// Stored as a bare 10-digit Indian mobile number (see AddressForm.tsx) — Meta
// expects country code + number, digits only, no leading 0 or +.
const hashPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, '')
  const withCountryCode = digits.length === 10 ? `91${digits}` : digits
  return sha256(withCountryCode)
}

interface PurchaseEventInput {
  eventId:        string  // our order ID — must match the client-side fbq eventID for dedup
  value:          number
  email?:         string | null
  phone?:         string | null
  clientIp?:      string | null
  userAgent?:     string | null
  fbp?:           string | null  // _fbp cookie, set by the browser pixel
  fbc?:           string | null  // _fbc cookie, set when the visit came from a Meta ad click
  eventSourceUrl: string
}

export async function sendPurchaseEvent(input: PurchaseEventInput): Promise<void> {
  if (!PIXEL_ID || !ACCESS_TOKEN) {
    // Not configured yet (access token not generated) — skip silently rather
    // than throwing, so checkout itself is never affected by ad-tracking setup.
    return
  }

  const userData: Record<string, unknown> = {}
  if (input.email)      userData.em = [hashEmail(input.email)]
  if (input.phone)      userData.ph = [hashPhone(input.phone)]
  if (input.clientIp)   userData.client_ip_address = input.clientIp
  if (input.userAgent)  userData.client_user_agent = input.userAgent
  if (input.fbp)        userData.fbp = input.fbp
  if (input.fbc)        userData.fbc = input.fbc

  const body = {
    data: [
      {
        event_name:       'Purchase',
        event_time:        Math.floor(Date.now() / 1000),
        event_id:           input.eventId,
        event_source_url:   input.eventSourceUrl,
        action_source:      'website',
        user_data:           userData,
        custom_data: {
          currency:     'INR',
          value:         input.value,
          content_type: 'product',
        },
      },
    ],
  }

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
    {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:     JSON.stringify(body),
    }
  )

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Meta Conversions API request failed (${res.status}): ${errorBody}`)
  }
}
