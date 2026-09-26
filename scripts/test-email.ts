// ─────────────────────────────────────────────────────────────────────────────
// scripts/test-email.ts
// Sends one test email through lib/email.ts to check the Google Workspace
// SMTP setup (SMTP_USER + SMTP_APP_PASSWORD) works, before relying on it for
// real orders. Prints the actual error from Google if it fails.
//
// Usage:
//   npx tsx --env-file=.env.local scripts/test-email.ts you@example.com
// ─────────────────────────────────────────────────────────────────────────────

import { sendMail } from '../lib/email'

const to = process.argv[2]

if (!to) {
  console.error('Usage: npx tsx --env-file=.env.local scripts/test-email.ts <recipient email>')
  process.exit(1)
}

async function main() {
  const from = process.env.SMTP_FROM || process.env.SMTP_USER
  console.log(`Signing in as ${process.env.SMTP_USER ?? '(SMTP_USER not set)'}, sending as ${from ?? '(not set)'} to ${to} …`)

  const { error } = await sendMail({
    to,
    subject: 'Louis Polo — test email',
    html: '<p>If you can read this, order emails from louispolo.in are working through Google Workspace.</p>',
  })

  if (error) {
    console.error('\nFAILED:', error.message)
    process.exit(1)
  }
  console.log('\nSent. Check the recipient inbox (and spam) and the sender mailbox\'s Sent folder.')
  if (process.env.SMTP_FROM && process.env.SMTP_FROM !== process.env.SMTP_USER) {
    console.log(`IMPORTANT: open the received email and confirm the From address is ${process.env.SMTP_FROM}.`)
    console.log('If it shows the SMTP_USER address instead, Google has not accepted the alias yet — see the notes.')
  }
}

main()
