'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/about/FactoryStats.tsx
// Factory capability numbers + testing checklist, from the LP trade brochure.
// Shown on the About page directly under FactoryGallery, backing up the
// factory photos with the actual numbers. Brand-level story stats stay in
// BrandStory; this section owns the factory-floor ones.
// ─────────────────────────────────────────────────────────────────────────────

import { motion }                            from 'framer-motion'
import { Check }                             from 'lucide-react'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

const FACTORY_STATS = [
  { value: '3500+',      label: 'Bags produced daily'  },
  { value: '60,000',     label: 'Sq ft factory area'   },
  { value: '10,000',     label: 'Sq ft warehouse'      },
  { value: '150+',       label: 'Factory employees'    },
  { value: '95%',        label: 'Self-made materials'  },
]

const TESTED_FOR = [
  'Drop & impact resistance',
  'Handle strength',
  'Zipper durability',
  'Wheel endurance',
]

export function FactoryStats() {
  return (
    <section className="section-pad bg-[var(--color-lp-cream)]">
      <div className="container-lp">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            Our factory
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg mb-2">
            Built at scale. Tested piece by piece.
          </motion.h2>

          {/* ── Stat grid ── */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-8 gap-y-10">
            {FACTORY_STATS.map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp} className="flex flex-col gap-1">
                <p className="font-display leading-none text-lp-ink" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.75rem)' }}>
                  {value}
                </p>
                <p className="font-body text-[0.65rem] tracking-[0.18em] uppercase text-lp-muted">
                  {label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── Testing checklist ── */}
          <motion.div variants={fadeUp} className="mt-12 pt-8 border-t border-lp-ink/10">
            <p className="font-body text-[0.6rem] tracking-[0.18em] uppercase text-lp-faint mb-5">
              Every piece is rigorously tested for
            </p>
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              {TESTED_FOR.map(item => (
                <div key={item} className="flex items-center gap-2">
                  <Check size={14} strokeWidth={2} className="text-[var(--color-lp-gold)] flex-shrink-0" />
                  <span className="font-body text-[0.85rem] text-lp-muted">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
