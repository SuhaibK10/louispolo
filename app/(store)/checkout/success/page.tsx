'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/checkout/success/page.tsx
// Lands here after /api/checkout/verify has confirmed payment.
// Reads orderId + total from URL params (passed by checkout page after verify)
// so it works for both logged-in and guest users — no Supabase RLS needed.
// ─────────────────────────────────────────────────────────────────────────────

import { Suspense, useEffect } from 'react'
import { useSearchParams }     from 'next/navigation'
import Link                    from 'next/link'
import { motion }              from 'framer-motion'
import { CheckCircle2, ArrowRight, Package } from 'lucide-react'
import { formatPrice }         from '@/lib/utils'
import { ROUTES }              from '@/lib/constants'
import { metaTrack }           from '@/lib/metaPixel'

function CheckoutSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const total   = searchParams.get('total')

  // Fires once per order, not once per page load — a refresh or back/forward
  // nav here would otherwise report the same order as a repeat purchase.
  // eventID uses the order ID so a later Conversions API call for this same
  // order can be deduplicated against this client-side event instead of
  // double-counting the sale.
  useEffect(() => {
    if (!orderId) return
    const key = `meta-purchase-tracked:${orderId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, '1')
    return metaTrack('Purchase', {
      value:    total ? Number(total) : undefined,
      currency: 'INR',
      content_type: 'product',
    }, orderId)
  }, [orderId, total])

  if (!orderId) {
    return (
      <>
        <h1 className="lp-heading-md mb-2">We couldn't find that order</h1>
        <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] mb-6">
          If you completed a payment, check your email for confirmation, or contact support with your payment details.
        </p>
        <Link href={ROUTES.home} className="btn-primary inline-flex">
          Return home
          <ArrowRight size={15} strokeWidth={1.5} />
        </Link>
      </>
    )
  }

  return (
    <>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        <CheckCircle2 size={56} strokeWidth={1.5} className="text-[var(--color-lp-gold)] mx-auto mb-6" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <h1 className="lp-heading-lg mb-3">Order confirmed</h1>
        <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] mb-8">
          Thank you for your order. A confirmation has been sent to your email.
        </p>

        <div className="bg-[var(--color-lp-cream)] p-6 mb-8 text-left">
          <div className="flex items-center gap-2 mb-3">
            <Package size={16} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
            <span className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)]">
              Order Summary
            </span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">Order ID</span>
            <span className="font-body text-[0.8rem] text-[var(--color-lp-ink)] font-mono">
              {orderId.slice(0, 8).toUpperCase()}
            </span>
          </div>
          {total && (
            <div className="flex justify-between">
              <span className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">Total Paid</span>
              <span className="font-display text-[1rem] text-[var(--color-lp-ink)]">
                {formatPrice(Number(total))}
              </span>
            </div>
          )}
        </div>

        <Link href={ROUTES.shop} className="btn-primary inline-flex">
          Continue shopping
          <ArrowRight size={15} strokeWidth={1.5} />
        </Link>
      </motion.div>
    </>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <div className="pt-16 md:pt-18 min-h-[80vh] flex items-center justify-center px-6">
      <div className="text-center max-w-[28rem]">
        <Suspense fallback={
          <p className="font-body text-[var(--color-lp-muted)]">Loading order details...</p>
        }>
          <CheckoutSuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
