'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/BrandStory.tsx
// Manufacturing trust signal — consumer voice, not B2B voice.
// "10+ years building luggage for the world's biggest brands. Now we build it for you."
// ─────────────────────────────────────────────────────────────────────────────

import Link                                  from 'next/link'
import { motion }                            from 'framer-motion'
import { ArrowRight }                        from 'lucide-react'
import { ROUTES }                            from '@/lib/constants'
import { slideFromLeft, slideFromRight, VIEWPORT } from '@/lib/animations'

const PILLARS = [
  {
    number: '01',
    label:  'Manufacturing',
    copy:   'Our Bhiwandi factory has produced luggage for global brands for 10+ years. The same machines, the same QC, now working for you.',
  },
  {
    number: '02',
    label:  'Materials',
    copy:   'ABS and polycarbonate shells selected for impact resistance. Spinner wheels rated for 500+ trips. No shortcuts.',
  },
  {
    number: '03',
    label:  'Design',
    copy:   'Every product goes through our Mumbai design team before it touches a factory floor. Function and form, never one without the other.',
  },
]

export function BrandStory() {
  return (
    <section className="section-pad bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)]" style={{ paddingTop: '2.5rem' }}>
      <div className="container-lp">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

          {/* Left — hero copy */}
          <motion.div
            variants={slideFromLeft}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
          >
            <span className="lp-eyebrow text-[var(--color-lp-gold)]">Our story</span>
            <h2 className="lp-heading-lg text-[var(--color-lp-porcelain)] mb-6">
              10+ years building for the world's biggest brands.
              <span className="text-[var(--color-lp-gold)] "> Now we build it for you.</span>
            </h2>
            <p className="font-body text-[var(--color-lp-porcelain)]/60 text-base leading-relaxed mb-8">
              Louis Polo started as an OEM manufacturer, making luggage for brands you have carried through airports all over the world. In 2025, we decided to put our name on it. Same factory, same materials, same quality control. Your price just removed the middleman.
            </p>
            <Link href={ROUTES.about} className="btn-gold inline-flex">
              Read our story
              <ArrowRight size={15} strokeWidth={1.5} />
            </Link>
          </motion.div>

          {/* Right — pillars */}
          <motion.div
            variants={slideFromRight}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="space-y-0 divide-y divide-white/10"
          >
            {PILLARS.map(({ number, label, copy }) => (
              <div key={number} className="py-6 first:pt-0 last:pb-0 flex gap-5">
                <span className="font-body text-[0.65rem] tracking-[0.14em] text-[var(--color-lp-gold)] flex-shrink-0 pt-0.5">
                  {number}
                </span>
                <div>
                  <h3 className="font-display text-[1.1rem] text-[var(--color-lp-porcelain)] mb-2 leading-snug">
                    {label}
                  </h3>
                  <p className="font-body text-[0.85rem] text-[var(--color-lp-porcelain)]/55 leading-relaxed">
                    {copy}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Office cities strip */}
        <div className="mt-12 pt-8 border-t border-white/10 flex justify-between items-end">

          {[
            { city: 'Mumbai',    flag: '🇮🇳' },
            { city: 'London',    flag: '🇬🇧' },
            { city: 'Hong Kong', flag: '🇭🇰' },
          ].map(({ city, flag }) => (
            <div key={city} className="flex flex-col items-center gap-1">
              <span className="text-2xl">{flag}</span>
              <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-lp-porcelain/70">{city}</p>
            </div>
          ))}

        </div>
      </div>
    </section>
  )
}
