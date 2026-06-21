'use server'

import { resend, EMAIL_FROM } from '@/lib/resend'
import { BRAND }              from '@/lib/constants'

export type ContactResult = { ok: true } | { ok: false; error: string }

export async function sendContactEnquiry(formData: FormData): Promise<ContactResult> {
  const name    = (formData.get('name')    as string | null)?.trim() ?? ''
  const email   = (formData.get('email')   as string | null)?.trim() ?? ''
  const message = (formData.get('message') as string | null)?.trim() ?? ''

  if (!email || !message) return { ok: false, error: 'Email and message are required.' }

  const { error } = await resend.emails.send({
    from:    EMAIL_FROM,
    to:      [BRAND.teamEmail, BRAND.email],
    replyTo: email,
    subject: `Contact enquiry${name ? ` from ${name}` : ''} — louispolo.in`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;">
        <h2 style="font-size:18px;">New contact enquiry</h2>
        ${name    ? `<p><strong>Name:</strong> ${name}</p>`    : ''}
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;">${message}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Contact enquiry email failed:', error)
    return { ok: false, error: 'Failed to send. Please try WhatsApp or email us directly.' }
  }

  return { ok: true }
}
