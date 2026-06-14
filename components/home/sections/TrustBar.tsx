'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/TrustBar.tsx
// Animated stat counters. Numbers count up when section enters viewport.
// Pattern borrowed directly from B&B Appliances TrustBar.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState }       from 'react'
import { motion, useInView }                 from 'framer-motion'
import { BRAND_STATS }                       from '@/config/products'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

// ─── Counter that counts up from 0 to target ─────────────────────────────────
function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref               = useRef<HTMLSpanElement>(null)
  const inView            = useInView(ref, { once: true, margin: '-60px' })

  useEffect(() => {
    if (!inView) return
    const start    = performance.now()
    const duration = 1800

    const tick = (now: number) => {
      const elapsed  = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease-out expo
      const eased = 1 - Math.pow(2, -10 * progress)
      setCount(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(tick)
    }

    requestAnimationFrame(tick)
  }, [inView, target])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function TrustBar() {
  return (
    <section className="bg-[var(--color-lp-cream)] border-y border-[var(--color-lp-border)] py-12 md:py-14">
      <div className="container-lp">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 md:divide-x md:divide-[var(--color-lp-border)]"
        >
          {BRAND_STATS.map(({ value, suffix, label }) => (
            <motion.div
              key={label}
              variants={fadeUp}
              className="flex flex-col items-center text-center md:px-8"
            >
              <p className="font-display text-[2.5rem] md:text-[3rem] leading-none tracking-tight text-[var(--color-lp-ink)] mb-1">
                <Counter target={value} suffix={suffix} />
              </p>
              <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-[var(--color-lp-muted)]">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
