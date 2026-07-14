'use client'

// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/checkout/page.tsx
// Three-step checkout: review → shipping → payment. Single page, internal
// step state — NOT three routes, since that would mean losing in-memory
// form state on every navigation unless lifted to a global store, which
// is unnecessary complexity for a flow this contained.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import { useRouter }                from 'next/navigation'
import Image                        from 'next/image'
import Link                         from 'next/link'
import { motion, AnimatePresence }  from 'framer-motion'
import { ChevronLeft, ArrowRight, Loader2, ShieldCheck, User, Mail, Phone } from 'lucide-react'
import { useCartStore }             from '@/store/cartStore'
import { createClient }             from '@/lib/supabase/client'
import { thumbUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }              from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'
import { AddressForm, EMPTY_ADDRESS, type ShippingAddress } from '@/components/checkout/AddressForm'
import type { User as SupabaseUser } from '@supabase/supabase-js'

type Step = 'review' | 'shipping' | 'payment'

// Razorpay's checkout.js attaches itself to window — not a proper import,
// since it's loaded via a <script> tag. This declares its shape so TS
// doesn't complain about an unknown global.
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void
    }
  }
}

const STEP_ORDER: Step[] = ['review', 'shipping', 'payment']

function StepIndicator({ current }: { current: Step }) {
  const labels: Record<Step, string> = {
    review:   'Review',
    shipping: 'Shipping',
    payment:  'Payment',
  }
  const currentIndex = STEP_ORDER.indexOf(current)

  return (
    <div className="flex items-center gap-1.5 mb-10">
      {STEP_ORDER.map((step, i) => (
        <div key={step} className="flex items-center gap-1.5">
          <div className="flex items-center gap-1.5">
            <motion.div
              animate={{
                backgroundColor: i <= currentIndex ? 'var(--color-lp-ink)' : 'var(--color-lp-border)',
                color:           i <= currentIndex ? 'var(--color-lp-porcelain)' : 'var(--color-lp-muted)',
              }}
              className="w-6 h-6 rounded-full flex items-center justify-center font-body text-[0.7rem] font-medium"
            >
              {i + 1}
            </motion.div>
            <span
              className={
                i === currentIndex
                  ? 'font-body text-[0.6rem] tracking-[0.04em] uppercase text-lp-ink'
                  : 'font-body text-[0.6rem] tracking-[0.04em] uppercase text-lp-faint'
              }
            >
              {labels[step]}
            </span>
          </div>
          {i < STEP_ORDER.length - 1 && (
            <div className="w-5 h-px bg-[var(--color-lp-border)]" />
          )}
        </div>
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  const router = useRouter()
  const items  = useCartStore(s => s.items)
  const clearCart = useCartStore(s => s.clearCart)

  const [mounted, setMounted] = useState(false)
  const [step, setStep] = useState<Step>('review')
  const [direction, setDirection] = useState(1) // for slide direction

  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [authChecked, setAuthChecked] = useState(false)
  const [guestMode, setGuestMode] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [guestPhone, setGuestPhone] = useState('')

  const [address, setAddress] = useState<ShippingAddress>(EMPTY_ADDRESS)
  const [addressValid, setAddressValid] = useState(false)

  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  // Prevent SSR mismatch with Zustand localStorage, same pattern as cart page.
  useEffect(() => { setMounted(true) }, [])

  // Check auth state once on mount — informs whether we show the
  // sign-in/guest choice at all, or skip straight past it for a logged-in user.
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      setAuthChecked(true)
    })
  }, [])

  // Load Razorpay's checkout script once. Loaded imperatively rather than
  // via next/script's default strategy, since we need to know definitively
  // when it's ready before allowing the Pay button to be pressed.
  useEffect(() => {
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) {
      setRazorpayLoaded(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
  }, [])

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const total = subtotal // shipping is free — see CART_CONFIG

  const goToStep = useCallback((next: Step) => {
    const currentIdx = STEP_ORDER.indexOf(step)
    const nextIdx = STEP_ORDER.indexOf(next)
    setDirection(nextIdx > currentIdx ? 1 : -1)
    setStep(next)
  }, [step])

  // ── Can we proceed from "review" into "shipping"? ───────────────────────
  // Requires EITHER a logged-in user OR (guestMode + valid email + phone).
  const canProceedFromReview =
    user !== null || (guestMode && guestEmail.includes('@') && guestPhone.replace(/\D/g, '').length === 10)

  // ── The actual payment flow ──────────────────────────────────────────────
  async function handlePayment() {
    setIsProcessing(true)
    setPaymentError(null)

    try {
      const checkoutBody = {
        items: items.map(item => ({
          productSlug: item.productSlug,
          color:       item.color,
          size:        item.size,
          quantity:    item.quantity,
        })),
        shipping: {
          fullName:     address.fullName,
          phone:        address.phone,
          addressLine1: address.addressLine1,
          addressLine2: address.addressLine2 || undefined,
          city:         address.city,
          state:        address.state,
          pincode:      address.pincode,
        },
        ...(!user && {
          guestContact: { email: guestEmail, phone: guestPhone },
        }),
      }

      const createRes = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(checkoutBody),
      })

      const createData = await createRes.json()

      if (!createRes.ok) {
        setPaymentError(createData.error ?? 'Could not start checkout.')
        setIsProcessing(false)
        return
      }

      const { orderId, razorpayOrderId, amount, currency } = createData

      // ── Open Razorpay's modal ───────────────────────────────────────────
      const razorpay = new window.Razorpay({
        key:      process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount,
        currency,
        order_id: razorpayOrderId,
        name:     'Louis Polo',
        description: `Order of ${items.length} item${items.length > 1 ? 's' : ''}`,
        prefill: {
          name:    address.fullName,
          contact: address.phone,
          email:   user?.email ?? guestEmail,
        },
        theme: { color: '#C9A96E' }, // matches --color-lp-gold

        handler: async (response: {
          razorpay_order_id:   string
          razorpay_payment_id: string
          razorpay_signature:  string
        }) => {
          // This callback firing means the modal closed successfully —
          // it is NOT proof of payment on its own. The verify route does
          // the actual cryptographic check before we trust it.
          try {
            const verifyRes = await fetch('/api/checkout/verify', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpay_order_id:   response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature:  response.razorpay_signature,
              }),
            })

            const verifyData = await verifyRes.json()

            if (!verifyRes.ok) {
              setPaymentError(verifyData.error ?? 'Payment verification failed.')
              setIsProcessing(false)
              return
            }

            clearCart()
            router.push(`/checkout/success?orderId=${orderId}&total=${verifyData.total ?? ''}`)
          } catch {
            setPaymentError('Payment verification failed. If money was deducted, contact support with your order details.')
            setIsProcessing(false)
          }
        },

        modal: {
          // Fires if the user closes the modal without paying — distinct
          // from a failed payment, so we just reset the processing state
          // rather than showing an error.
          ondismiss: () => setIsProcessing(false),
        },
      })

      razorpay.open()
    } catch {
      setPaymentError('Something went wrong. Please try again.')
      setIsProcessing(false)
    }
  }

  if (!mounted || !authChecked) return null

  if (items.length === 0) {
    return (
      <div className="pt-16 md:pt-[4.5rem] min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="font-display text-2xl text-[var(--color-lp-ink)]">Your cart is empty</h1>
          <Link href={ROUTES.shop} className="btn-primary inline-flex mt-2">
            Browse collection
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  const slideVariants = {
    enter:  (dir: number) => ({ opacity: 0, x: dir > 0 ? 24 : -24 }),
    center: { opacity: 1, x: 0 },
    exit:   (dir: number) => ({ opacity: 0, x: dir > 0 ? -24 : 24 }),
  }

  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad pt-6! md:pt-8! max-w-[42rem]">
        <Link
          href={ROUTES.cart}
          className="flex items-center gap-1 font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200 mb-6"
        >
          <ChevronLeft size={13} strokeWidth={1.5} />
          Back to cart
        </Link>

        <h1 className="lp-heading-lg mb-2">Checkout</h1>
        <StepIndicator current={step} />

        <AnimatePresence mode="wait" custom={direction}>
          {/* ── STEP 1: Review ─────────────────────────────────────────── */}
          {step === 'review' && (
            <motion.div
              key="review"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="space-y-3 mb-8">
                {items.map(item => (
                  <div key={item.variantKey} className="flex gap-4 items-center py-3 border-b border-[var(--color-lp-border)] last:border-0">
                    <div className="relative w-14 h-[72px] bg-[var(--color-lp-cream)] flex-shrink-0">
                      <Image
                        src={thumbUrl(item.image) || PLACEHOLDER_URL}
                        alt={item.productName}
                        fill
                        className="object-cover object-center"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-display text-[0.95rem] text-[var(--color-lp-ink)] truncate">{item.productName}</p>
                      <p className="font-body text-[0.75rem] text-[var(--color-lp-muted)]">
                        {item.color}{item.size ? ` · ${item.size}` : ''} · Qty {item.quantity}
                      </p>
                    </div>
                    <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)]">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* ── Auth choice ────────────────────────────────────────── */}
              {user ? (
                <div className="flex items-center gap-2 p-4 bg-[var(--color-lp-cream)] mb-6">
                  <User size={16} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
                  <p className="font-body text-[0.85rem] text-[var(--color-lp-ink)]">
                    Signed in as <span className="font-medium">{user.email}</span>
                  </p>
                </div>
              ) : (
                <div className="mb-6 space-y-3">
                  <AnimatePresence mode="wait">
                    {!guestMode ? (
                      <motion.div
                        key="choice"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        <Link
                          href={`/account/login?redirect=/checkout`}
                          className="btn-outline w-full justify-center"
                        >
                          Sign in
                        </Link>
                        <button
                          onClick={() => setGuestMode(true)}
                          className="btn-outline w-full justify-center"
                        >
                          Continue as guest
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="guest-form"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3 p-4 bg-[var(--color-lp-cream)]"
                      >
                        <p className="font-body text-[0.75rem] tracking-[0.08em] uppercase text-[var(--color-lp-muted)]">
                          Guest checkout
                        </p>
                        <div className="relative">
                          <Mail size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-lp-faint)]" />
                          <input
                            type="email"
                            placeholder="Email address"
                            value={guestEmail}
                            onChange={e => setGuestEmail(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 bg-[var(--color-lp-porcelain)] border border-[var(--color-lp-border)] font-body text-[0.85rem] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
                          />
                        </div>
                        <div className="relative">
                          <Phone size={15} strokeWidth={1.5} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-lp-faint)]" />
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={guestPhone}
                            onChange={e => setGuestPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            className="w-full h-11 pl-10 pr-4 bg-[var(--color-lp-porcelain)] border border-[var(--color-lp-border)] font-body text-[0.85rem] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
                          />
                        </div>
                        <button
                          onClick={() => setGuestMode(false)}
                          className="font-body text-[0.7rem] text-[var(--color-lp-faint)] hover:text-[var(--color-lp-ink)] transition-colors duration-200"
                        >
                          ← Sign in instead
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              <div className="flex justify-between items-center mb-6 pt-4 border-t border-[var(--color-lp-border)]">
                <span className="font-display text-[1.1rem]">Total</span>
                <span className="font-display text-[1.4rem]">{formatPrice(total)}</span>
              </div>

              <button
                onClick={() => goToStep('shipping')}
                disabled={!canProceedFromReview}
                className="btn-primary w-full justify-center disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue to shipping
                <ArrowRight size={15} strokeWidth={1.5} />
              </button>
            </motion.div>
          )}

          {/* ── STEP 2: Shipping ───────────────────────────────────────── */}
          {step === 'shipping' && (
            <motion.div
              key="shipping"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <AddressForm
                value={address}
                onChange={setAddress}
                onValidChange={setAddressValid}
              />

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => goToStep('review')}
                  className="btn-outline flex-1 justify-center"
                >
                  Back
                </button>
                <button
                  onClick={() => goToStep('payment')}
                  disabled={!addressValid}
                  className="btn-primary flex-1 justify-center disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue to payment
                  <ArrowRight size={15} strokeWidth={1.5} />
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Payment ────────────────────────────────────────── */}
          {step === 'payment' && (
            <motion.div
              key="payment"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div className="bg-[var(--color-lp-cream)] p-6 mb-6">
                <h2 className="font-display text-[1.1rem] mb-4">Shipping to</h2>
                <p className="font-body text-[0.85rem] text-[var(--color-lp-ink)] leading-relaxed">
                  {address.fullName}<br />
                  {address.addressLine1}{address.addressLine2 ? `, ${address.addressLine2}` : ''}<br />
                  {address.city}, {address.state} {address.pincode}<br />
                  {address.phone}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--color-lp-border)]">
                <span className="font-display text-[1.1rem]">Total</span>
                <span className="font-display text-[1.4rem]">{formatPrice(total)}</span>
              </div>

              <AnimatePresence>
                {paymentError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="p-3 bg-[var(--color-lp-error)]/10 border border-[var(--color-lp-error)]/30 mb-4"
                  >
                    <p className="font-body text-[0.8rem] text-[var(--color-lp-error)]">{paymentError}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3">
                <button
                  onClick={() => goToStep('shipping')}
                  disabled={isProcessing}
                  className="btn-outline flex-1 justify-center disabled:opacity-40"
                >
                  Back
                </button>
                <motion.button
                  onClick={handlePayment}
                  disabled={isProcessing || !razorpayLoaded}
                  whileTap={{ scale: 0.98 }}
                  className="btn-gold flex-[2] justify-center disabled:opacity-60"
                >
                  {isProcessing ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : !razorpayLoaded ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <>
                      Pay {formatPrice(total)}
                      <ArrowRight size={15} strokeWidth={1.5} />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="flex items-center justify-center gap-1.5 mt-4">
                <ShieldCheck size={13} strokeWidth={1.5} className="text-[var(--color-lp-faint)]" />
                <p className="font-body text-[0.7rem] text-[var(--color-lp-faint)]">
                  Secure payment powered by Razorpay
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
