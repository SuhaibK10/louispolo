'use server'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/actions.ts
// Server actions used by footer client islands.
// Newsletter signups are forwarded to the team inbox via Resend — same
// pattern as the contact form (app/(store)/contact/actions.ts).
// ─────────────────────────────────────────────────────────────────────────────

import { resend, EMAIL_FROM } from '@/lib/resend'
import { BRAND }              from '@/lib/constants'

export type NewsletterResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function subscribeNewsletter(email: string): Promise<NewsletterResult> {
  const value = email.trim().toLowerCase()

  if (!value || value.length > 254 || !EMAIL_RE.test(value)) {
    return { ok: false, error: 'Please enter a valid email address.' }
  }

  const { error } = await resend.emails.send({
    from:     EMAIL_FROM,
    to:       BRAND.teamEmail,
    reply_to: value,
    subject:  `Newsletter signup: ${value}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="font-size:18px;">New newsletter subscriber</h2>
        <p><strong>Email:</strong> ${value}</p>
        <p style="color:#777;font-size:13px;">Signed up via the site footer.</p>
      </div>
    `,
  })

  if (error) {
    console.error('Newsletter signup email failed:', error)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }

  return { ok: true }
}
