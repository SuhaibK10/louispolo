// ─────────────────────────────────────────────────────────────────────────────
// app/api/checkout/route.ts
// Creates a Razorpay order + a 'pending' row in our own orders table.
//
// Supports BOTH logged-in users and guest checkout. If a session exists,
// the order is attached to user_id. If not, the request must include
// guest contact info instead — enforced by the DB check constraint added
// in 002_guest_checkout.sql, not just by this route's own validation.
//
// CRITICAL: prices are NEVER trusted from the client, regardless of which
// path (auth or guest) is taken. The client sends product id / color /
// size / quantity — this route looks up the real price from
// config/products.ts itself. If we trusted client-sent prices, anyone
// could edit the request in devtools and pay whatever they want.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server'
import Razorpay from 'razorpay'
import { createClient, createServiceRoleClient } from '@/lib/supabase/server'
import { getProductBySlug } from '@/config/products'
import { SALE_CONFIG }      from '@/lib/constants'
import type { ProductSize } from '@/types'

const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
})

interface CheckoutLineInput {
  productSlug: string
  color:       string
  size:        ProductSize
  quantity:    number
}

interface CheckoutRequestBody {
  items: CheckoutLineInput[]
  shipping: {
    fullName:     string
    phone:        string
    addressLine1: string
    addressLine2?: string
    city:         string
    state:        string
    pincode:      string
  }
  // Only required if there is no logged-in session. Ignored entirely if
  // the user is authenticated — a logged-in user's email/phone come from
  // their account, not from a guest field the client could otherwise spoof.
  guestContact?: {
    email: string
    phone: string
  }
}

export async function POST(request: NextRequest) {
const supabase = await createClient()

  // ── Auth check — now informational, not a hard gate ─────────────────────
  // We still call getUser() to see if a session exists, but a missing
  // session no longer rejects the request outright. It instead routes
  // into the guest path below.
  const { data: { user } } = await supabase.auth.getUser()

  const body: CheckoutRequestBody = await request.json()
  const { items, shipping, guestContact } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
  }

  // ── Guest path requires contact info; logged-in path does not ──────────
  // This is enforced here AND at the DB level via the
  // orders_user_or_guest_check constraint — defense in depth, since this
  // route's own validation could theoretically have a bug, but the DB
  // constraint cannot be bypassed by any code path.
  if (!user && (!guestContact?.email || !guestContact?.phone)) {
    return NextResponse.json(
      { error: 'Email and phone are required for guest checkout.' },
      { status: 400 }
    )
  }

  // ── Validate shipping fields are present ────────────────────────────────
  const requiredShippingFields: (keyof CheckoutRequestBody['shipping'])[] = [
    'fullName', 'phone', 'addressLine1', 'city', 'state', 'pincode',
  ]
  for (const field of requiredShippingFields) {
    if (!shipping?.[field]) {
      return NextResponse.json(
        { error: `Missing required field: ${field}` },
        { status: 400 }
      )
    }
  }

  // ── Recalculate every line item server-side ─────────────────────────────
  // This is the part that actually matters for security. We rebuild the
  // order from our own product data, not from whatever the client sent.
  // Identical for both auth and guest paths — pricing logic doesn't care
  // who's buying.
  const orderItems: {
    product_id:   string
    product_name: string
    product_slug: string
    image:        string
    color:        string
    color_hex:    string
    size:         string
    price:        number
    quantity:     number
  }[] = []

  let subtotal = 0

  for (const line of items) {
    const product = getProductBySlug(line.productSlug)
    if (!product) {
      return NextResponse.json(
        { error: `Product not found: ${line.productSlug}` },
        { status: 400 }
      )
    }

    const variant = product.variants.find(
      v => v.color.toLowerCase() === line.color.toLowerCase()
    )
    if (!variant) {
      return NextResponse.json(
        { error: `Color "${line.color}" not available for ${product.name}` },
        { status: 400 }
      )
    }

    const sizeOption = variant.sizes.find(s => s.size === line.size)
    if (!sizeOption) {
      return NextResponse.json(
        { error: `Size "${line.size}" not available for ${product.name} in ${line.color}` },
        { status: 400 }
      )
    }

    if (line.quantity < 1 || line.quantity > 10) {
      return NextResponse.json(
        { error: `Invalid quantity for ${product.name}` },
        { status: 400 }
      )
    }

    if (sizeOption.stock === 0) {
      return NextResponse.json(
        { error: `${product.name} (${line.color}, ${line.size}) is currently out of stock` },
        { status: 400 }
      )
    }

    const lineTotal = sizeOption.price * line.quantity
    subtotal += lineTotal

    orderItems.push({
      product_id:   product.id,
      product_name: product.name,
      product_slug: product.slug,
      image:        product.images[0],
      color:        variant.color,
      color_hex:    variant.colorHex,
      size:         line.size,
      price:        sizeOption.price,
      quantity:     line.quantity,
    })
  }

  // Shipping is free on all orders right now — see CART_CONFIG.
  const shippingCost = 0

  // Site-wide checkout discount (see SALE_CONFIG) — applied here, and only
  // here, since this route is the sole source of truth for what Razorpay
  // actually charges. subtotal stays the pre-discount sum so order records
  // reflect real MRP; the discount only shows up in `total`.
  const discount = SALE_CONFIG.enabled
    ? Math.round(subtotal * SALE_CONFIG.discountPercent)
    : 0
  const total = subtotal - discount + shippingCost

  // ── Create the order row ─────────────────────────────────────────────────
  // Branches on whether a session exists. The DB check constraint
  // (orders_user_or_guest_check) is the real enforcement — this is just
  // building the right insert payload for whichever path applies.
  const orderPayload = {
    user_id:       user?.id ?? null,
    guest_email:   user ? null : guestContact!.email,
    guest_phone:   user ? null : guestContact!.phone,
    full_name:     shipping.fullName,
    phone:         shipping.phone,
    address_line1: shipping.addressLine1,
    address_line2: shipping.addressLine2 ?? null,
    city:          shipping.city,
    state:         shipping.state,
    pincode:       shipping.pincode,
    subtotal,
    shipping:      shippingCost,
    total,
    status:        'pending' as const,
  }

  // Guest inserts use the service-role client to bypass RLS — the anon
  // role has an RLS policy for this, but PostgREST may not have reloaded
  // it, and a guest has no user identity for RLS to enforce against anyway.
  // All fields were validated above before reaching this point.
  const insertClient = user ? supabase : createServiceRoleClient()

  console.log('ORDER PAYLOAD:', JSON.stringify(orderPayload, null, 2))
  const { data: orderRow, error: insertError } = await insertClient
    .from('orders')
    .insert(orderPayload)
    .select()
    .single()

  if (insertError || !orderRow) {
    console.error('Failed to create order row:', insertError)
    return NextResponse.json(
      { error: 'Could not create order. Please try again.' },
      { status: 500 }
    )
  }

  // ── Insert line items ────────────────────────────────────────────────────
  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems.map(item => ({ ...item, order_id: orderRow.id })))

  if (itemsError) {
    console.error('Failed to insert order items:', itemsError)
    await supabase.from('orders').update({ status: 'failed' }).eq('id', orderRow.id)
    return NextResponse.json(
      { error: 'Could not create order. Please try again.' },
      { status: 500 }
    )
  }

  // ── Create the Razorpay order ────────────────────────────────────────────
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount:   total * 100,
      currency: 'INR',
      receipt:  orderRow.id,
      notes: {
        order_id: orderRow.id,
        user_id:  user?.id ?? 'guest',
      },
    })

    await supabase
      .from('orders')
      .update({ razorpay_order_id: razorpayOrder.id })
      .eq('id', orderRow.id)

    return NextResponse.json({
      orderId:         orderRow.id,
      razorpayOrderId: razorpayOrder.id,
      amount:          total * 100,
      currency:        'INR',
    })
  } catch (razorpayError) {
    console.error('Razorpay order creation failed:', razorpayError)
    await supabase.from('orders').update({ status: 'failed' }).eq('id', orderRow.id)
    return NextResponse.json(
      { error: 'Payment gateway error. Please try again.' },
      { status: 500 }
    )
  }
}
