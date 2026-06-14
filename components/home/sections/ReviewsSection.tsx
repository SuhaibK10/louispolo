'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ReviewsSection.tsx
// Social proof. Real names, real trip contexts, real quotes.
// Replace placeholder copy with verified customer reviews before launch.
// ─────────────────────────────────────────────────────────────────────────────

import { motion }                            from 'framer-motion'
import { Star }                              from 'lucide-react'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

const REVIEWS = [
  {
    name:    'Priya Sharma',
    city:    'Mumbai',
    trip:    'Mumbai → London',
    product: 'AeroSmart 3-in-1',
    rating:  5,
    text:    'Carried this to London and back — zero scratches, zero issues at customs. The front pocket saved me every single time I had to pull out my laptop at security. Worth every rupee.',
  },
  {
    name:    'Arjun Mehta',
    city:    'Bengaluru',
    trip:    'Bangalore → Dubai',
    product: 'SkyTrail 28"',
    rating:  5,
    text:    'The wheels on this thing are insane. Walked through three terminals in Dubai and it glided the whole time. Two weeks of stuff fit in the 28" easily. I get compliments on it every trip.',
  },
  {
    name:    'Kavya Reddy',
    city:    'Hyderabad',
    trip:    'Family vacation — Goa',
    product: 'SoftSquare Set of 3',
    rating:  5,
    text:    'Bought the set for our family trip. My kids were fighting over who gets which colour. They all opened without issues at the resort. Solid quality and they look really premium for the price.',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={13}
          strokeWidth={1.5}
          className={i < rating ? 'fill-[var(--color-lp-gold)] text-[var(--color-lp-gold)]' : 'text-[var(--color-lp-border)]'}
        />
      ))}
    </div>
  )
}

export function ReviewsSection() {
  return (
    <section className="section-pad">
      <div className="container-lp">

        {/* Header */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mb-10 md:mb-12"
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            Travellers who trust us
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            Real trips. Real reviews.
          </motion.h2>
        </motion.div>

        {/* Cards */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
        >
          {REVIEWS.map((review) => (
            <motion.div
              key={review.name}
              variants={fadeUp}
              className="lp-card p-6 md:p-7 flex flex-col gap-4"
            >
              {/* Stars + product */}
              <div className="flex items-start justify-between gap-3">
                <StarRating rating={review.rating} />
                <span className="font-body text-[0.6rem] tracking-[0.1em] uppercase text-[var(--color-lp-faint)] flex-shrink-0">
                  {review.product}
                </span>
              </div>

              {/* Quote */}
              <p className="font-body text-[0.9rem] text-[var(--color-lp-ink)] leading-relaxed flex-1">
                "{review.text}"
              </p>

              {/* Attribution */}
              <div className="border-t border-[var(--color-lp-border)] pt-4">
                <p className="font-body text-[0.8rem] font-medium text-[var(--color-lp-ink)]">
                  {review.name}
                </p>
                <p className="font-body text-[0.7rem] text-[var(--color-lp-muted)]">
                  {review.city} · {review.trip}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
