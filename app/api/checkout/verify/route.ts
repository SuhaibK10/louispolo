// ─────────────────────────────────────────────────────────────────────────────
// app/api/checkout/verify/route.ts
// Razorpay's checkout modal calls back into the frontend on success, but that
// callback is NOT proof of payment — it's just the browser telling us "the
// modal closed successfully." The actual proof is a signature Razorpay
// generates using your key secret. We recompute that signature here,
// server-side, and only mark the order 'paid' if it matches exactly.
//
// Works for both logged-in and guest orders. The signature check is
// identical either way — it doesn't care who's buying, only whether the
// payment claim is cryptographically real.
//
// This route uses the service-role Supabase client deliberately — marking
// an order 'paid' is something only verified server logic should be able to
// do, which is why there's no RLS update policy for regular users on the
// orders table. Bypassing RLS here is intentional, not a shortcut.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { createClient } from '@/lib/supabase/server'
import { sendOrderConfirmationEmail, sendOrderNotificationEmail } from '@/lib/resend'

interface VerifyRequestBody {
  orderId:             string  // our internal order UUID
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
}

export async function POST(request: NextRequest) {
  // No longer a hard auth gate — a guest has no session at all, and that's
  // expected. We just check IF a session exists, for the optional
  // belt-and-suspenders ownership check further down.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const body: VerifyRequestBody = await request.json()
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing verification fields.' }, { status: 400 })
  }

  // ── Recompute the expected signature ────────────────────────────────────
  // Razorpay's documented formula: HMAC-SHA256 of "{order_id}|{payment_id}",
  // signed with your key secret. If this doesn't match exactly, the payment
  // claim is not trustworthy — could be a replay, a tampered request, or
  // a payment that never actually completed on Razorpay's end. This check
  // is the ENTIRE security model here — it does not depend on auth state.
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    const serviceClient = createServiceRoleClient()
    await serviceClient
      .from('orders')
      .update({ status: 'failed' })
      .eq('id', orderId)

    return NextResponse.json(
      { error: 'Payment verification failed.' },
      { status: 400 }
    )
  }

  // ── Signature is valid — mark the order paid ────────────────────────────
  const serviceClient = createServiceRoleClient()

  // If a session exists, scope the update to that user's own order as an
  // extra check (belt-and-suspenders, same as before). If there's no
  // session (guest checkout), we can't scope by user_id since there isn't
  // one — the signature check above is what actually secures this either way.
  let query = serviceClient
    .from('orders')
    .update({
      status:              'paid',
      razorpay_payment_id,
      updated_at:          new Date().toISOString(),
    })
    .eq('id', orderId)

  if (user) {
    query = query.eq('user_id', user.id)
  }

  const { data: order, error: updateError } = await query.select().single()

  if (updateError || !order) {
    console.error('Failed to mark order as paid:', updateError)
    return NextResponse.json(
      { error: 'Payment succeeded but order update failed. Contact support.' },
      { status: 500 }
    )
  }

  // ── Send order emails ────────────────────────────────────────────────────
  // Best-effort and awaited (so they actually complete before this
  // serverless function exits), but a failure here never blocks the success
  // response — the payment is already verified and saved either way.
  const recipientEmail = user?.email ?? order.guest_email
  if (recipientEmail) {
    const { data: orderItems } = await serviceClient
      .from('order_items')
      .select('product_name, color, size, price, quantity')
      .eq('order_id', orderId)

    await Promise.all([
      sendOrderConfirmationEmail({
        to: recipientEmail,
        orderId: order.id,
        total: order.total,
        items: orderItems ?? [],
      }).catch((err) => console.error('Order confirmation email failed:', err)),

      sendOrderNotificationEmail({
        orderId: order.id,
        total: order.total,
        items: orderItems ?? [],
        customerEmail: recipientEmail,
        shipping: {
          fullName:     order.full_name,
          phone:        order.phone,
          addressLine1: order.address_line1,
          addressLine2: order.address_line2,
          city:         order.city,
          state:        order.state,
          pincode:      order.pincode,
        },
      }).catch((err) => console.error('Order notification email failed:', err)),
    ])
  }

  return NextResponse.json({ success: true, orderId: order.id, total: order.total })
}
