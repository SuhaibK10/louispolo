// ─────────────────────────────────────────────────────────────────────────────
// app/api/checkout/route.ts
// Creates a Razorpay order + a 'pending' row in our own orders table.
//
// CRITICAL: prices are NEVER trusted from the client. The client sends
// product id / color / size / quantity — this route looks up the real price
// from config/products.ts itself. If we trusted client-sent prices, anyone
// could edit the request in devtools and pay whatever they want.
// ─────────────────────────────────────────────────────────────────────────────

import { NextResponse, type NextRequest } from 'next/server'
import Razorpay from 'razorpay'
import { createClient } from '@/lib/supabase/server'
import { getProductBySlug } from '@/config/products'
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
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // ── Auth check ──────────────────────────────────────────────────────────
  // Checkout requires a logged-in user since orders are tied to user_id
  // (no guest checkout — see orders table schema, user_id is not nullable).
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json(
      { error: 'You must be signed in to checkout.' },
      { status: 401 }
    )
  }

  const body: CheckoutRequestBody = await request.json()
  const { items, shipping } = body

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 })
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

    // Stock check kept loose intentionally — stock numbers in config/products.ts
    // are placeholder data right now (confirmed: stock tracking is not a
    // current priority). We still block a hard zero, since "0 in stock" was
    // explicitly set on a few SKUs and shouldn't be purchasable regardless.
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

  // Shipping is free on all orders right now — see CART_CONFIG. If this
  // changes later, the shipping calculation goes here, server-side, for
  // the same reason prices are recalculated here: never trust the client
  // for anything that affects the amount charged.
  const shippingCost = 0
  const total = subtotal + shippingCost

  // ── Create the order row first (status: pending) ────────────────────────
  // We create our own order record BEFORE calling Razorpay, so that even if
  // the Razorpay API call fails, we have a record of the attempt with a
  // real UUID we can reference. The razorpay_order_id gets attached right after.
  const { data: orderRow, error: insertError } = await supabase
    .from('orders')
    .insert({
      user_id:       user.id,
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
      status:        'pending',
    })
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
    // Order row exists but items failed — mark it failed rather than leaving
    // a pending order with no line items, which would be confusing to debug
    // later and impossible to fulfil correctly.
    await supabase.from('orders').update({ status: 'failed' }).eq('id', orderRow.id)
    return NextResponse.json(
      { error: 'Could not create order. Please try again.' },
      { status: 500 }
    )
  }

  // ── Create the Razorpay order ────────────────────────────────────────────
  // Razorpay amounts are in paise. Everything else in this app (DB, UI,
  // config/products.ts) works in plain rupees — this is the ONLY place
  // that conversion happens, deliberately isolated to this one boundary.
  try {
    const razorpayOrder = await razorpay.orders.create({
      amount:   total * 100,
      currency: 'INR',
      receipt:  orderRow.id,
      notes: {
        order_id: orderRow.id,
        user_id:  user.id,
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
