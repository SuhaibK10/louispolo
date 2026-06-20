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
    image:    'Generated_Image_June_21_2026_-_2_58AM_xtfwjz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: 'scale-125',
  },
  {
    label:    'Sets',
    value:    'set',
    mood:     'The complete setup',
    image:    'Generated_Image_June_21_2026_-_3_01AM_no4abz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: 'scale-125',
  },
  {
    label:    'Backpacks',
    value:    'backpack',
    mood:     'Carry it all',
    image:    'Generated_Image_June_18_2026_-_2_00AM_jssdry.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Office Bags',
    value:    'office-bag',
    mood:     'Sharp every day',
    image:    'Generated_Image_June_18_2026_-_2_56AM_fubmpz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Duffle Bags',
    value:    'duffle',
    mood:     'Light, fast, flexible',
    image:    'Generated_Image_June_18_2026_-_1_53AM_jpxswo.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Vanity Cases',
    value:    'vanity',
    mood:     'Small bag, big difference',
    image:    'Screenshot_2026-06-18_at_3.35.17_AM_cu1ffy.png',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
] as const

export function CategoryGrid() {
  return (
    <section className="section-pad bg-[var(--color-lp-cream)]" style={{ paddingTop: '1.5rem' }}>
      <div className="container-lp">


        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <span className="lp-eyebrow">Find your bag</span>
          <h2 className="lp-heading-lg">Shop by Category</h2>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
        >
          {CATEGORY_CARDS.map(({ label, value, mood, image, span, imgClass }) => (
            <motion.div
              key={value}
              variants={scaleUp}
              className={span}
            >
              <Link
                href={`${ROUTES.shop}?category=${value}`}
                className="group relative block aspect-[4/5] md:aspect-square overflow-hidden bg-lp-border"
              >
                {/* Image */}
                <Image
                  src={cardUrl(image) || PLACEHOLDER_URL}
                  alt={label}
                  fill
                  className={`object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${imgClass}`}
                  sizes="(max-width:768px) 50vw, (max-width:1280px) 25vw, 22rem"
                />

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-lp-ink/90 via-lp-ink/30 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

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
