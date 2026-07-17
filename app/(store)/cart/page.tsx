'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/cart/page.tsx
// Cart page — reads from Zustand, shows items, totals, and checkout CTA.
// Shipping is free on all orders (see CART_CONFIG in lib/constants.ts).
// Checkout button now opens the real flow at /store/checkout.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState }    from 'react'
import Image                      from 'next/image'
import Link                       from 'next/link'
import { useRouter }              from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore }           from '@/store/cartStore'
import { thumbUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }            from '@/lib/utils'
import { ROUTES }                 from '@/lib/constants'
import type { CartItem }          from '@/types'

// ─── Cart item row ────────────────────────────────────────────────────────────
function CartRow({ item }: { item: CartItem }) {
  const updateQty   = useCartStore(s => s.updateQty)
  const removeItem  = useCartStore(s => s.removeItem)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -16, transition: { duration: 0.2 } }}
      className="flex gap-4 py-5 border-b border-[var(--color-lp-border)] last:border-0"
    >
      {/* Image */}
      <Link href={`${ROUTES.shop}/${item.productSlug}`} className="flex-shrink-0">
        <div className="relative w-[72px] h-[96px] bg-[var(--color-lp-cream)] overflow-hidden">
          <Image
            src={thumbUrl(item.image) || PLACEHOLDER_URL}
            alt={item.productName}
            fill
            className="object-cover object-center"
            sizes="72px"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <Link href={`${ROUTES.shop}/${item.productSlug}`}>
            <p className="font-display text-[1rem] text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors duration-200 truncate">
              {item.productName}
            </p>
          </Link>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.colorHex }}
              title={item.color}
            />
            <p className="font-body text-[0.72rem] text-[var(--color-lp-muted)]">
              {item.color}{item.size ? ` · ${item.size}` : ''}
            </p>
          </div>
        </div>

        {/* Qty + price row */}
        <div className="flex items-center justify-between mt-2">
          {/* Qty controls */}
          <div className="flex items-center border border-[var(--color-lp-border)]">
            <button
              onClick={() => updateQty(item.variantKey, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={13} strokeWidth={1.5} />
            </button>
            <span className="w-8 text-center font-body text-[0.8rem] text-[var(--color-lp-ink)] tabular-nums">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.variantKey, item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={13} strokeWidth={1.5} />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <p className="font-body text-[0.9rem] font-medium text-[var(--color-lp-ink)]">
              {formatPrice(item.price * item.quantity)}
            </p>
            <button
              onClick={() => removeItem(item.variantKey)}
              className="text-[var(--color-lp-faint)] hover:text-[var(--color-lp-error)] transition-colors duration-200"
              aria-label="Remove item"
            >
              <Trash2 size={15} strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function CartPage() {
  const items     = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)
  const router    = useRouter()
  const [mounted, setMounted] = useState(false)

  // Prevent SSR mismatch with Zustand localStorage
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  // Shipping is always free — see CART_CONFIG in lib/constants.ts. No
  // threshold check needed since there's no longer a paid tier.
  const total    = subtotal

  if (items.length === 0) {
    return (
      <div className="pt-16 md:pt-[4.5rem] min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <ShoppingBag size={48} strokeWidth={1} className="text-[var(--color-lp-border)] mx-auto" />
          <h1 className="font-display text-3xl text-[var(--color-lp-ink)]">Your cart is empty</h1>
          <p className="font-body text-[var(--color-lp-muted)] text-sm">
            Looks like you haven't added anything yet.
          </p>
          <Link href={ROUTES.shop} className="btn-primary inline-flex mt-4 rounded-md">
            Browse collection
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad pt-8! md:pt-10! pb-24! md:pb-32!">
        <h1 className="lp-heading-lg mb-8 md:mb-10">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 md:gap-12">
          {/* Items */}
          <div>
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <CartRow key={item.variantKey} item={item} />
              ))}
            </AnimatePresence>

            <button
              onClick={clearCart}
              className="mt-4 font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-faint)] hover:text-[var(--color-lp-error)] transition-colors duration-200"
            >
              Clear cart
            </button>
          </div>

          {/* Order summary */}
          <div className="bg-[var(--color-lp-cream)] p-6 md:p-8 h-fit">
            <h2 className="font-display text-[1.25rem] mb-6">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">Subtotal</span>
                <span className="font-body text-[0.85rem] text-[var(--color-lp-ink)] font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">Shipping</span>
                <span className="font-body text-[0.85rem] text-[var(--color-lp-success)]">Free</span>
              </div>
            </div>

            <div className="lp-hr mb-4" />

            <div className="flex justify-between mb-6">
              <span className="font-display text-[1rem]">Total</span>
              <span className="font-display text-[1.25rem]">{formatPrice(total)}</span>
            </div>

            {/* Checkout — navigates to the multi-step checkout flow */}
            <button
              onClick={() => router.push('/checkout')}
              className="btn-gold w-full justify-center"
            >
              Proceed to Checkout
              <ArrowRight size={15} strokeWidth={1.5} />
            </button>

            <p className="text-center font-body text-[0.68rem] text-[var(--color-lp-faint)] mt-3">
              Secure checkout via Razorpay
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
