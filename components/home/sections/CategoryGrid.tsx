'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/CategoryGrid.tsx
// Visual category cards with product imagery. Not text links.
// Each card is a destination mood that makes you want to travel.
// ─────────────────────────────────────────────────────────────────────────────

import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion }                            from 'framer-motion'
import { ArrowUpRight }                      from 'lucide-react'
import { ROUTES }                            from '@/lib/constants'
import { cardUrl, PLACEHOLDER_URL }          from '@/lib/cloudinary'
import { staggerChildren, scaleUp, VIEWPORT } from '@/lib/animations'

// Category card data — images are Cloudinary public_ids
// Replace with real product images once uploaded
const CATEGORY_CARDS = [
  {
    label:    'Trolley Bags',
    value:    'trolley',
    mood:     'For every journey',
    image:    'louispolo/categories/cat-trolley',
    span:     'md:col-span-2 md:row-span-2',  // large card
    textPos:  'bottom',
  },
  {
    label:    'Sets',
    value:    'set',
    mood:     'The complete setup',
    image:    'louispolo/categories/cat-sets',
    span:     '',
    textPos:  'bottom',
  },
  {
    label:    'Backpacks',
    value:    'backpack',
    mood:     'Carry it all',
    image:    'louispolo/categories/cat-backpack',
    span:     '',
    textPos:  'bottom',
  },
  {
    label:    'Office Bags',
    value:    'office-bag',
    mood:     'Sharp every day',
    image:    'louispolo/categories/cat-office',
    span:     '',
    textPos:  'bottom',
  },
] as const

export function CategoryGrid() {
  return (
    <section className="section-pad bg-[var(--color-lp-cream)]">
      <div className="container-lp">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <span className="lp-eyebrow">Explore</span>
          <h2 className="lp-heading-lg">Shop by Category</h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4"
        >
          {CATEGORY_CARDS.map(({ label, value, mood, image, span }) => (
            <motion.div
              key={value}
              variants={scaleUp}
              className={span}
            >
              <Link
                href={`${ROUTES.shop}?category=${value}`}
                className="group relative block aspect-[4/5] md:h-full overflow-hidden bg-[var(--color-lp-border)]"
              >
                {/* Image */}
                <Image
                  src={cardUrl(image) || PLACEHOLDER_URL}
                  alt={label}
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  sizes="(max-width:768px) 50vw, (max-width:1280px) 25vw, 22rem"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/70 via-transparent to-transparent transition-opacity duration-300 group-hover:opacity-90" />

                {/* Text */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                  <p className="font-body text-[0.6rem] tracking-[0.15em] uppercase text-[var(--color-lp-gold)] mb-1">
                    {mood}
                  </p>
                  <div className="flex items-end justify-between">
                    <h3 className="font-display text-[1.25rem] md:text-[1.5rem] text-[var(--color-lp-porcelain)] leading-none">
                      {label}
                    </h3>
                    <ArrowUpRight
                      size={18}
                      strokeWidth={1.5}
                      className="text-[var(--color-lp-porcelain)]/50 group-hover:text-[var(--color-lp-gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
                    />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
