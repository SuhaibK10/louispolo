// ─────────────────────────────────────────────────────────────────────────────
// config/coupons.ts
// One-off promo codes. Most are scoped to a single product + size (only those
// line items get discounted, everything else in the cart stays full price);
// a `bundle` coupon requires ALL listed product+size pairs to be present in
// the cart and discounts only those matching line items; a coupon with none
// of productSlug/size/bundle applies to the whole cart subtotal instead —
// the only difference from SALE_CONFIG is that this one needs a code typed
// in rather than being automatic.
//
// Not persisted anywhere — a code stays live until you flip `enabled` to
// false or delete its entry. There's no redemption cap; it's a "special
// code you hand out," not a single-use-ever code (that would need a DB
// table to track redemptions, which this intentionally skips).
// ─────────────────────────────────────────────────────────────────────────────

import type { ProductSize } from '@/types'

export interface Coupon {
  code:            string        // entered by the customer, case-insensitive
  label:           string        // shown next to the discount line at checkout
  discountPercent: number        // 0.4 = 40% off
  productSlug?:    string        // omit for a site-wide coupon (whole cart)
  size?:           ProductSize   // only used when productSlug is set
  // Multi-product bundle scope — takes priority over productSlug/size when
  // present. ALL of these product+size pairs must be in the cart for the
  // coupon to qualify; the discount then applies only to those matching
  // line items (any other cart contents stay full price), not the whole
  // subtotal. Use this instead of a site-wide coupon whenever a discount is
  // meant for one specific combination of products — a site-wide coupon has
  // no way to require specific cart contents, so it can be used on any cart.
  bundle?:         { productSlug: string; size: ProductSize }[]
  enabled:         boolean
}

interface CouponLineItem {
  productSlug: string
  size:        ProductSize | null
  price:       number
  quantity:    number
}

// Does this cart contain everything the coupon requires? True for a
// site-wide coupon (nothing required beyond having items at all).
export function couponQualifies(coupon: Coupon, items: CouponLineItem[]): boolean {
  if (coupon.bundle) {
    return coupon.bundle.every(req =>
      items.some(i => i.productSlug === req.productSlug && i.size === req.size)
    )
  }
  if (coupon.productSlug) {
    return items.some(i => i.productSlug === coupon.productSlug && i.size === coupon.size)
  }
  return true
}

// The subtotal the coupon's discountPercent actually applies to — only the
// bundle's/product's matching line items for a scoped coupon, the whole cart
// for a site-wide one. Caller should only call this after couponQualifies.
export function couponEligibleSubtotal(coupon: Coupon, items: CouponLineItem[]): number {
  if (coupon.bundle) {
    return items
      .filter(i => coupon.bundle!.some(req => req.productSlug === i.productSlug && req.size === i.size))
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
  }
  if (coupon.productSlug) {
    return items
      .filter(i => i.productSlug === coupon.productSlug && i.size === coupon.size)
      .reduce((sum, i) => sum + i.price * i.quantity, 0)
  }
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0)
}

export const COUPONS: Coupon[] = [
  {
    code:            'FTB10',
    label:           '10% off your order',
    // Advertised as a "first-time buyer" code in the homepage promo ticker,
    // but there's no order-history check here (or anywhere else in the
    // codebase) to enforce that — it's site-wide and works for anyone,
    // repeat customers included.
    discountPercent: 0.1,
    enabled:         true,
  },
  {
    code:            'DIAMOND40',
    label:           '40% off DiamondLux Set of 3',
    discountPercent: 0.4,
    productSlug:     'diamondlux-set',
    size:            'Set of 3',
    enabled:         true,
  },
  {
    code:            'VISHVA30',
    label:           '30% off your order',
    discountPercent: 0.3,
    enabled:         true,
  },
  {
    code:            'NITIN15',
    label:           '15% off your order',
    discountPercent: 0.15,
    enabled:         true,
  },
  {
    code:            'HERITAGE2099',
    label:           'Heritage for ₹2,099',
    discountPercent: 0.157028,
    productSlug:     'heritage-briefcase',
    size:            'One Size',
    enabled:         true,
  },
  {
    code:            'HERITAGE1499',
    label:           'Heritage for ₹1,499',
    discountPercent: 0.397992,
    productSlug:     'heritage-briefcase',
    size:            'One Size',
    enabled:         true,
  },
  {
    code:            'HERITAGE1799',
    label:           'Heritage for ₹1,799',
    discountPercent: 0.27751,
    productSlug:     'heritage-briefcase',
    size:            'One Size',
    enabled:         true,
  },
  {
    code:            'AEROSMART3990',
    label:           'AeroSmart 3-in-1 for ₹3,990',
    discountPercent: 0.10337078651685393,
    productSlug:     'aerosmart-3in1',
    size:            'Cabin',
    enabled:         true,
  },
  {
    code:            'AEROSMARTPRO4290',
    label:           'AeroSmart Pro for ₹4,290',
    discountPercent: 0.1402805611222445,
    productSlug:     'aerosmart-pro',
    size:            'Cabin',
    enabled:         true,
  },
  {
    code:            'TRAVELBUNDLE12990',
    label:           'AeroSmart 3-in-1 + SwiftGate + StrataLux Set of 2 bundle — ₹12,990',
    // Requires all three below in the cart (any color, since bundle scoping
    // is by product+size only) — won't fire for any other cart. Discounts
    // only these 3 line items; anything else in the cart stays full price.
    // Exact for one of each: AeroSmart 3-in-1 Cabin (₹4,450) + SwiftGate 17"
    // (₹3,490) + StrataLux Set of 2 (₹8,499) = ₹16,439 → ₹12,990.
    discountPercent: 0.20980594926698704,
    bundle: [
      { productSlug: 'aerosmart-3in1',  size: 'Cabin' },
      { productSlug: 'swiftgate',       size: '17 Inch' },
      { productSlug: 'stratalux-set-2', size: 'Cabin + Medium' },
    ],
    enabled:         true,
  },
]

export function getCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase()
  if (!normalized) return undefined
  return COUPONS.find(c => c.enabled && c.code === normalized)
}
