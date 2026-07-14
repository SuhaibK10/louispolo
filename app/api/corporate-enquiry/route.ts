import { NextResponse }  from 'next/server'
import { type NextRequest } from 'next/server'
import { resend, EMAIL_FROM } from '@/lib/resend'
import { BRAND }            from '@/lib/constants'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { company, name, email, phone, quantity, message } = await request.json()

  if (!company || !name || !email || !phone) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Record the lead first — email delivery can fail (Resend outage, unverified
  // domain), and a corporate lead is too valuable to lose. Service-role client:
  // the table has RLS on with no policies, so only the server can touch it.
  let savedToDb = false
  try {
    const supabase = createServiceRoleClient()
    const { error: dbError } = await supabase.from('corporate_enquiries').insert({
      company,
      name,
      email,
      phone,
      quantity: quantity || null,
      message:  message  || null,
    })
    if (dbError) {
      console.error('Failed to save corporate enquiry:', dbError)
    } else {
      savedToDb = true
    }
  } catch (e) {
    console.error('Failed to save corporate enquiry:', e)
  }

  const { error } = await resend.emails.send({
    from:    EMAIL_FROM,
    to:      BRAND.teamEmail,
    reply_to: email,
    subject: `Corporate Enquiry from ${company}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1714;">
        <h1 style="font-size: 20px; margin-bottom: 4px;">New Corporate Enquiry</h1>
        <p style="color: #888; font-size: 13px; margin-top: 0;">Submitted via louispoloworld.com</p>
        <hr style="border: none; border-top: 1px solid #e5e1d8; margin: 20px 0;" />
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Company</td><td style="padding: 6px 0; font-weight: 600;">${company}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Contact Person</td><td style="padding: 6px 0;">${name}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Phone</td><td style="padding: 6px 0;">${phone}</td></tr>
          ${quantity ? `<tr><td style="padding: 6px 0; color: #888;">Quantity / Requirement</td><td style="padding: 6px 0;">${quantity}</td></tr>` : ''}
        </table>
        ${message ? `
        <hr style="border: none; border-top: 1px solid #e5e1d8; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; margin-bottom: 6px;">Message</p>
        <p style="font-size: 14px; line-height: 1.6;">${message}</p>` : ''}
      </div>
    `,
  })

  // Fail the request only if BOTH channels failed — if the lead is in the
  // database, it is not lost even when the email bounces.
  if (error && !savedToDb) {
    return NextResponse.json({ error: 'Failed to send enquiry' }, { status: 500 })
  }
  if (error) {
    console.error('Corporate enquiry email failed (lead saved to DB):', error)
  }

  return NextResponse.json({ success: true })
}
