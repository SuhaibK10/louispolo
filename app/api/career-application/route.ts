import { NextResponse }  from 'next/server'
import { type NextRequest } from 'next/server'
import { resend, EMAIL_FROM } from '@/lib/resend'
import { BRAND }            from '@/lib/constants'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { role, name, email, portfolioUrl, tools, message } = await request.json()

  if (!role || !name || !email || !portfolioUrl) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Record the application first — email delivery can fail (Resend outage,
  // unverified domain), and an application is too valuable to lose.
  // Service-role client: the table has RLS on with no policies, so only the
  // server can touch it.
  let savedToDb = false
  try {
    const supabase = createServiceRoleClient()
    const { error: dbError } = await supabase.from('career_applications').insert({
      role,
      name,
      email,
      portfolio_url: portfolioUrl,
      tools:   tools   || null,
      message: message || null,
    })
    if (dbError) {
      console.error('Failed to save career application:', dbError)
    } else {
      savedToDb = true
    }
  } catch (e) {
    console.error('Failed to save career application:', e)
  }

  const { error } = await resend.emails.send({
    from:    EMAIL_FROM,
    to:      BRAND.teamEmail,
    reply_to: email,
    subject: `Career application: ${role} from ${name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1714;">
        <h1 style="font-size: 20px; margin-bottom: 4px;">New Career Application</h1>
        <p style="color: #888; font-size: 13px; margin-top: 0;">Submitted via louispolo.in/careers</p>
        <hr style="border: none; border-top: 1px solid #e5e1d8; margin: 20px 0;" />
        <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; color: #888; width: 140px;">Role</td><td style="padding: 6px 0; font-weight: 600;">${role}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Name</td><td style="padding: 6px 0;">${name}</td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Email</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #C9A96E;">${email}</a></td></tr>
          <tr><td style="padding: 6px 0; color: #888;">Portfolio</td><td style="padding: 6px 0;"><a href="${portfolioUrl}" style="color: #C9A96E;">${portfolioUrl}</a></td></tr>
          ${tools ? `<tr><td style="padding: 6px 0; color: #888;">Tools</td><td style="padding: 6px 0;">${tools}</td></tr>` : ''}
        </table>
        ${message ? `
        <hr style="border: none; border-top: 1px solid #e5e1d8; margin: 20px 0;" />
        <p style="color: #888; font-size: 12px; margin-bottom: 6px;">Note</p>
        <p style="font-size: 14px; line-height: 1.6;">${message}</p>` : ''}
      </div>
    `,
  })

  // Fail the request only if BOTH channels failed — if the application is in
  // the database, it is not lost even when the email bounces.
  if (error && !savedToDb) {
    return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 })
  }
  if (error) {
    console.error('Career application email failed (saved to DB):', error)
  }

  return NextResponse.json({ success: true })
}
