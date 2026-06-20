'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ReviewsSection.tsx
// Social proof. Real names, real trip contexts, real quotes.
// Replace placeholder copy with verified customer reviews before launch.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }                          from 'react'
import { motion, AnimatePresence }           from 'framer-motion'
import { Star, X }                           from 'lucide-react'
import Image                                 from 'next/image'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'
import { cld }                               from '@/lib/cloudinary'

const REVIEWS = [
  {
    name:    'Adnan Wahab',
    city:    'Delhi',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Took this to Kashmir last month , Gulmarg, Pahalgam, the whole route. Check-in was smooth. The front compartment is a game changer, I had my charger, snacks, docs all within reach. Zero stress the entire trip.',
    photos:  [
      'WhatsApp_Image_2026-06-20_at_22.54.06_ipkd7q.jpg',
      'WhatsApp_Image_2026-06-20_at_22.54.07_ygiymy.jpg',
      'WhatsApp_Image_2026-06-20_at_22.54.07_1_j5avd4.jpg',
    ] as string[],
  },
  {
    name:    'Arjun',
    city:    'Bengaluru',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Dubai airport is massive and I barely felt the bag. Wheels are buttery smooth. Packed for 2 weeks, zipped shut on the first try. Someone at the hotel literally asked me where I got it.',
    photos:  [] as string[],
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

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={28} strokeWidth={1.5} />
        </button>

        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1,    opacity: 1 }}
          exit={{    scale: 0.92, opacity: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm md:max-w-md aspect-square"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 448px"
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function ReviewsSection() {
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)

  return (
    <>
      <section className="section-pad" style={{ paddingTop: '1.5rem' }}>
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
              4.8 ★ · 1,000+ verified buyers
            </motion.span>
            <motion.h2 variants={fadeUp} className="lp-heading-lg">
              Packed, Travelled, Approved.
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

                {/* Customer photos */}
                {review.photos.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                    {review.photos.map((pid, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox({
                          src: cld(pid, 'f_auto,q_90,w_900,h_900,c_pad,b_rgb:F5F3ED'),
                          alt: `${review.name} photo ${i + 1}`,
                        })}
                        className="relative shrink-0 w-20 h-20 rounded-sm overflow-hidden bg-[var(--color-lp-porcelain)] cursor-zoom-in hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={cld(pid, 'f_auto,q_80,w_200,h_200,c_pad,b_rgb:F5F3ED')}
                          alt={`${review.name} photo ${i + 1}`}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Attribution */}
                <div className="border-t border-[var(--color-lp-border)] pt-4">
                  <p className="font-body text-[0.8rem] font-medium text-lp-ink">
                    {review.name}
                  </p>
                  <p className="font-body text-[0.7rem] text-lp-muted">
                    {review.city} · {review.trip}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox
          src={lightbox.src}
          alt={lightbox.alt}
          onClose={() => setLightbox(null)}
        />
      )}
    </>
  )
}
