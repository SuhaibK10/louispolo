'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ui/SpinToWinModal.tsx
// Homepage lead-capture wheel. Opens once, 7 seconds after a first-time
// visitor lands on a store page, gated by localStorage so it never shows
// twice to the same browser. Suppressed on /cart and /checkout — a popup
// mid-purchase would interrupt someone already converting.
//
// The wheel itself never decides its own result — it only renders
// SPIN_WHEEL_SEGMENTS for display, then animates to whichever segment index
// /api/spin-to-win returns. See config/spinWheel.ts for why that matters.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check } from 'lucide-react'
import { SPIN_WHEEL_SEGMENTS } from '@/config/spinWheel'

const STORAGE_KEY = 'lp_spin_to_win_shown'
const SEGMENT_ANGLE = 360 / SPIN_WHEEL_SEGMENTS.length
const SPIN_DURATION_MS = 4200

// Equal pie slices, alternating ink/porcelain — one conic-gradient instead
// of per-segment clip-path math, which is both simpler and renders
// predictably across browsers.
const WHEEL_BACKGROUND = `conic-gradient(from 0deg, ${SPIN_WHEEL_SEGMENTS.map((_, i) =>
  `${i % 2 === 0 ? 'var(--color-lp-ink)' : 'var(--color-lp-porcelain)'} ${i * SEGMENT_ANGLE}deg ${(i + 1) * SEGMENT_ANGLE}deg`
).join(', ')})`

type Result = { label: string; couponCode: string | null }

export function SpinToWinModal() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [spinning, setSpinning] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [result, setResult] = useState<Result | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const suppressed = pathname?.startsWith('/cart') || pathname?.startsWith('/checkout')

  useEffect(() => {
    if (suppressed) return
    if (typeof window === 'undefined') return
    if (localStorage.getItem(STORAGE_KEY)) return

    const timer = setTimeout(() => setOpen(true), 7000)
    return () => clearTimeout(timer)
    // Only ever arms once per mount — re-checking pathname mid-countdown
    // isn't worth the complexity for a one-shot popup.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, '1')
    setOpen(false)
  }

  const canSpin = name.trim().length > 0 && phone.replace(/\D/g, '').length === 10 && !spinning

  async function handleSpin() {
    if (!canSpin) return
    setSpinning(true)
    setError(null)

    try {
      const res = await fetch('/api/spin-to-win', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ name: name.trim(), phone }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong.')

      const index = data.segmentIndex as number
      // Land the chosen segment's center under the fixed top pointer —
      // several full spins first, purely for visual effect.
      const targetWithinCircle = 360 - (index * SEGMENT_ANGLE + SEGMENT_ANGLE / 2)
      const extraSpins = 5 * 360
      setRotation((prev) => prev - (prev % 360) + extraSpins + targetWithinCircle)

      setTimeout(() => {
        setResult({ label: data.label, couponCode: data.couponCode })
        setSpinning(false)
        localStorage.setItem(STORAGE_KEY, '1')
      }, SPIN_DURATION_MS)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setSpinning(false)
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }).catch(() => {})
  }

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    if (open) window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  if (suppressed) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[80] bg-black/60 flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={dismiss}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:max-w-2xl bg-[var(--color-lp-porcelain)] max-h-[92dvh] overflow-y-auto overscroll-contain"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={dismiss}
              className="absolute top-4 right-4 z-10 text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Wheel */}
              <div className="flex items-center justify-center p-8 bg-[var(--color-lp-cream)]">
                <div className="relative w-64 h-64">
                  {/* Pointer */}
                  <div
                    className="absolute left-1/2 -top-2 -translate-x-1/2 z-10 w-0 h-0"
                    style={{
                      borderLeft:  '10px solid transparent',
                      borderRight: '10px solid transparent',
                      borderTop:   '16px solid var(--color-lp-gold)',
                    }}
                  />
                  <div
                    className="relative w-full h-full rounded-full border-4 border-[var(--color-lp-gold)] overflow-hidden"
                    style={{
                      background: WHEEL_BACKGROUND,
                      transform:  `rotate(${rotation}deg)`,
                      transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.12, 0.67, 0.1, 0.99)`,
                    }}
                  >
                    {SPIN_WHEEL_SEGMENTS.map((segment, i) => (
                      <div
                        key={`label-${i}`}
                        className="absolute inset-0 flex justify-center"
                        style={{ transform: `rotate(${i * SEGMENT_ANGLE + SEGMENT_ANGLE / 2}deg)` }}
                      >
                        <span
                          className={`mt-3 font-body font-medium text-[0.62rem] leading-tight text-center w-16 ${
                            i % 2 === 0 ? 'text-[var(--color-lp-porcelain)]' : 'text-[var(--color-lp-ink)]'
                          }`}
                        >
                          {segment.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form / result */}
              <div className="p-6 md:p-8 flex flex-col justify-center gap-4">
                {result ? (
                  <>
                    <h2 className="font-display text-[1.4rem] text-[var(--color-lp-ink)] leading-tight">
                      {result.couponCode ? 'You won!' : 'So close!'}
                    </h2>
                    <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)]">
                      {result.label}
                    </p>
                    {result.couponCode ? (
                      <>
                        <p className="font-body text-[0.85rem] text-[var(--color-lp-ink)]">
                          Use this code at checkout:
                        </p>
                        <button
                          type="button"
                          onClick={() => copyCode(result.couponCode!)}
                          className="w-full h-12 px-4 flex items-center justify-between bg-[var(--color-lp-cream)] border border-[var(--color-lp-gold)] font-body font-semibold text-[1rem] tracking-[0.1em] text-[var(--color-lp-ink)]"
                        >
                          {result.couponCode}
                          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
                        </button>
                      </>
                    ) : (
                      <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">
                        No discount this time, but thanks for spinning.
                      </p>
                    )}
                    <button onClick={dismiss} className="btn-primary w-fit">
                      Continue shopping
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="font-display text-[1.4rem] text-[var(--color-lp-ink)] leading-tight">
                      Spin to win a discount
                    </h2>
                    <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">
                      Enter your name and number for a chance at a real discount code.
                    </p>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      disabled={spinning}
                      className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="Phone number"
                      disabled={spinning}
                      className="w-full h-12 px-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
                    />
                    {error && (
                      <p className="font-body text-[0.8rem] text-red-600">{error}</p>
                    )}
                    <button
                      type="button"
                      onClick={handleSpin}
                      disabled={!canSpin}
                      className="btn-primary w-full disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {spinning ? 'Spinning…' : 'Spin it'}
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
