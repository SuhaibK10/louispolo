// ─────────────────────────────────────────────────────────────────────────────
// scripts/reconcile-order.ts
// One-off admin fix for orders whose Razorpay payment succeeded but never
// got saved by app/api/checkout/verify/route.ts (see the 12 Sep 2026 checkout
// verification incident — a since-fixed bug). Marks the order paid and sends
// the exact same confirmation/notification emails a normal successful
// checkout would, by calling lib/resend.ts directly — so the customer gets
// the real, correctly formatted email, not a manual one-off.
//
// Usage (dry run first — prints what it would do, changes nothing):
//   npx tsx --env-file=.env.local scripts/reconcile-order.ts <orderId> <razorpayPaymentId>
// Then, once the printed details look right:
//   npx tsx --env-file=.env.local scripts/reconcile-order.ts <orderId> <razorpayPaymentId> --confirm
//
// IMPORTANT: point this at PRODUCTION credentials — NEXT_PUBLIC_SUPABASE_URL,
// SUPABASE_SERVICE_ROLE_KEY, and RESEND_API_KEY must be the live values, not
// local/dev ones, or this will either fail to find the order or (worse)
// silently do nothing against the wrong database.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '../lib/resend'
import { BRAND } from '../lib/constants'

const [orderId, razorpayPaymentId, ...flags] = process.argv.slice(2)
const confirmed = flags.includes('--confirm')

if (!orderId || !razorpayPaymentId) {
  console.error('Usage: npx tsx scripts/reconcile-order.ts <orderId> <razorpayPaymentId> [--confirm]')
  process.exit(1)
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  const { data: order, error } = await supabase.from('orders').select('*').eq('id', orderId).single()
  if (error || !order) {
    console.error('Order not found:', error)
    process.exit(1)
  }

  console.log('Found order:')
  console.log(`  id:          ${order.id}`)
  console.log(`  status:      ${order.status}`)
  console.log(`  total:       ₹${order.total}`)
  console.log(`  name:        ${order.full_name}`)
  console.log(`  user_id:     ${order.user_id ?? '(none — guest)'}`)
  console.log(`  guest_email: ${order.guest_email ?? '(none)'}`)

  if (order.status === 'paid') {
    console.log('\nAlready marked paid — nothing to do.')
    return
  }

  // Resolve recipient email — same precedence verify/route.ts uses.
  let recipientEmail: string | null = order.guest_email
  if (order.user_id) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(order.user_id)
    if (userError) console.error('Could not look up user email:', userError)
    recipientEmail = userData?.user?.email ?? recipientEmail
  }
  console.log(`  resolved recipient email: ${recipientEmail ?? '(none found!)'}`)

  if (!confirmed) {
    console.log('\nDry run only — no changes made. Re-run with --confirm to mark paid and send emails.')
    return
  }

  const { data: updated, error: updateError } = await supabase
    .from('orders')
    .update({
      status:              'paid',
      razorpay_payment_id: razorpayPaymentId,
      updated_at:          new Date().toISOString(),
    })
    .eq('id', orderId)
    .select()
    .single()

  if (updateError || !updated) {
    console.error('Failed to update order:', updateError)
    process.exit(1)
  }
  console.log('\nOrder marked paid.')

  const { data: orderItems } = await supabase
    .from('order_items')
    .select('product_name, color, size, price, quantity, image')
    .eq('order_id', orderId)

  if (!recipientEmail) {
    console.log('No recipient email found — both emails skipped. Send the customer confirmation manually.')
    return
  }

  await Promise.all([
    sendOrderConfirmationEmail({
      to:      recipientEmail,
      orderId: updated.id,
      total:   updated.total,
      items:   orderItems ?? [],
    }).catch((err) => console.error('Confirmation email failed:', err)),

    sendOrderNotificationEmail({
      orderId:       updated.id,
      total:         updated.total,
      items:         orderItems ?? [],
      customerEmail: recipientEmail,
      shipping: {
        fullName:     updated.full_name,
        phone:        updated.phone,
        addressLine1: updated.address_line1,
        addressLine2: updated.address_line2,
        city:         updated.city,
        state:        updated.state,
        pincode:      updated.pincode,
      },
    }).catch((err) => console.error('Notification email failed:', err)),
  ])

  console.log(`Emails sent to ${recipientEmail} and ${BRAND.teamEmail}.`)
}

main()
