// ─────────────────────────────────────────────────────────────────────────────
// lib/email.ts
// Email sending through Google Workspace SMTP (smtp.gmail.com) + the order
// email senders. Server-side only — SMTP_APP_PASSWORD has no NEXT_PUBLIC_
// prefix, so it's never exposed to the browser.
//
// Env:
//   SMTP_USER          the Workspace mailbox the site signs in as, e.g. support@louispolo.in
//   SMTP_APP_PASSWORD  a Google app password for that mailbox (16 characters,
//                      not the mailbox's normal login password)
//   SMTP_FROM          optional — the address customers see, e.g. orders@louispolo.in.
//                      Must be an alias of SMTP_USER (Admin console > Users >
//                      Alternate email addresses). Defaults to SMTP_USER.
//
// Two emails go out per paid order:
//   sendOrderConfirmationEmail — customer-facing, "thank you" tone
//   sendOrderNotificationEmail — internal, sent to BRAND.teamEmail, includes
//                                 the shipping address so the team can fulfill
// ─────────────────────────────────────────────────────────────────────────────

import nodemailer from 'nodemailer'
import { BRAND } from '@/lib/constants'
import { thumbUrl } from '@/lib/cloudflareImages'

const SMTP_USER         = process.env.SMTP_USER
const SMTP_APP_PASSWORD = process.env.SMTP_APP_PASSWORD

// Google only sends as the authenticated mailbox or one of its aliases — any
// other From address gets silently rewritten to the mailbox. Replies to an
// alias land in the mailbox's inbox, and every sent email shows in its Sent
// folder.
const EMAIL_FROM = `Louis Polo <${process.env.SMTP_FROM || SMTP_USER}>`

const transporter = nodemailer.createTransport({
  host:   'smtp.gmail.com',
  port:   465,
  secure: true,
  auth:   { user: SMTP_USER, pass: SMTP_APP_PASSWORD },
  // Fail fast — SMTP has no built-in timeout and checkout awaits these emails.
  connectionTimeout: 8_000,
  greetingTimeout:   8_000,
  socketTimeout:     12_000,
})

interface SendMailParams {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

// Never throws — returns { error } so callers keep the existing "log it and
// carry on" handling (an order must still complete when its email can't send).
export async function sendMail({ to, subject, html, replyTo }: SendMailParams): Promise<{ error: Error | null }> {
  if (!SMTP_USER || !SMTP_APP_PASSWORD) {
    return { error: new Error('SMTP_USER / SMTP_APP_PASSWORD are not set') }
  }
  try {
    await transporter.sendMail({ from: EMAIL_FROM, to, subject, html, replyTo })
    return { error: null }
  } catch (e) {
    return { error: e instanceof Error ? e : new Error(String(e)) }
  }
}

interface OrderConfirmationItem {
  product_name: string
  color: string
  size: string | null
  price: number
  quantity: number
  image?: string  // Cloudflare Images ID
}

// 56×56 thumbnail + name/variant/qty, used in the line-item table of both
// emails below.
function itemRow(item: OrderConfirmationItem): string {
  const thumb = item.image
    ? `<img src="${thumbUrl(item.image)}" width="56" height="56" alt="" style="display:block; width:56px; height:56px; object-fit:cover; border-radius:6px; background:#f2f0ec;" />`
    : ''
  return `
        <tr>
          <td style="padding:8px 0; width:56px;">${thumb}</td>
          <td style="padding:8px 0 8px 12px;">${item.product_name} (${item.color}${item.size ? `, ${item.size}` : ''}) × ${item.quantity}</td>
          <td style="padding:8px 0; text-align:right; white-space:nowrap;">₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
        </tr>`
}

interface OrderConfirmationParams {
  to: string
  orderId: string
  total: number
  items: OrderConfirmationItem[]
}

// ── Customer-facing: order confirmation ───────────────────────────────────
export async function sendOrderConfirmationEmail({
  to,
  orderId,
  total,
  items,
}: OrderConfirmationParams) {
  const itemRows = items.map(itemRow).join('')

  const { error } = await sendMail({
    to,
    subject: `Your Louis Polo order is confirmed (#${orderId.slice(0, 8).toUpperCase()})`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">Order confirmed</h1>
        <p>Thank you for your order. Here's a quick summary:</p>
        <table style="width:100%; border-collapse:collapse;">${itemRows}</table>
        <p style="margin-top:16px; font-weight:bold;">Total: ₹${total.toLocaleString('en-IN')}</p>
        <p style="color:#777; font-size:13px;">Order ID: ${orderId.slice(0, 8).toUpperCase()}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send order confirmation email:', error)
  }
}

// ── Internal: new order notification to the team ──────────────────────────
interface OrderNotificationParams {
  orderId: string
  total: number
  items: OrderConfirmationItem[]
  customerEmail: string
  shipping: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2: string | null
    city: string
    state: string
    pincode: string
  }
}

export async function sendOrderNotificationEmail({
  orderId,
  total,
  items,
  customerEmail,
  shipping,
}: OrderNotificationParams) {
  const itemRows = items.map(itemRow).join('')

  const { error } = await sendMail({
    to: BRAND.teamEmail,
    subject: `New order #${orderId.slice(0, 8).toUpperCase()} · ₹${total.toLocaleString('en-IN')}`,
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h1 style="font-size: 20px;">New order received</h1>
        <p><strong>Customer:</strong> ${customerEmail}</p>
        <table style="width:100%; border-collapse:collapse;">${itemRows}</table>
        <p style="margin-top:16px; font-weight:bold;">Total: ₹${total.toLocaleString('en-IN')}</p>
        <h2 style="font-size:16px; margin-top:24px;">Ship to</h2>
        <p>
          ${shipping.fullName}<br/>
          ${shipping.addressLine1}${shipping.addressLine2 ? `, ${shipping.addressLine2}` : ''}<br/>
          ${shipping.city}, ${shipping.state} ${shipping.pincode}<br/>
          ${shipping.phone}
        </p>
        <p style="color:#777; font-size:13px;">Order ID: ${orderId.slice(0, 8).toUpperCase()}</p>
      </div>
    `,
  })

  if (error) {
    console.error('Failed to send order notification email:', error)
  }
}
