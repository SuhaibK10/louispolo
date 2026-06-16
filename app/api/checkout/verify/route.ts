// ─────────────────────────────────────────────────────────────────────────────
// app/api/checkout/verify/route.ts
// Razorpay's checkout modal calls back into the frontend on success, but that
// callback is NOT proof of payment — it's just the browser telling us "the
// modal closed successfully." The actual proof is a signature Razorpay
// generates using your key secret. We recompute that signature here,
// server-side, and only mark the order 'paid' if it matches exactly.
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

interface VerifyRequestBody {
  orderId:           string  // our internal order UUID
  razorpay_order_id:   string
  razorpay_payment_id: string
  razorpay_signature:  string
}

export async function POST(request: NextRequest) {
  // Confirm there's still a logged-in session making this call — this
  // doesn't replace signature verification, it's a separate, additional
  // check that the request is coming from an authenticated context at all.
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 })
  }

  const body: VerifyRequestBody = await request.json()
  const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = body

  if (!orderId || !razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing verification fields.' }, { status: 400 })
  }

  // ── Recompute the expected signature ────────────────────────────────────
  // Razorpay's documented formula: HMAC-SHA256 of "{order_id}|{payment_id}",
  // signed with your key secret. If this doesn't match exactly, the payment
  // claim is not trustworthy — could be a replay, a tampered request, or
  // a payment that never actually completed on Razorpay's end.
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    // Mark the order failed — don't leave it sitting as 'pending' forever,
    // since that would make it indistinguishable from "user just hasn't
    // finished checkout yet" in any admin view we build later.
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
  const { data: order, error: updateError } = await serviceClient
    .from('orders')
    .update({
      status:              'paid',
      razorpay_payment_id,
      updated_at:          new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('user_id', user.id)  // belt-and-suspenders: only update if it's this user's order
    .select()
    .single()

  if (updateError || !order) {
    console.error('Failed to mark order as paid:', updateError)
    return NextResponse.json(
      { error: 'Payment succeeded but order update failed. Contact support.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, orderId: order.id })
}
