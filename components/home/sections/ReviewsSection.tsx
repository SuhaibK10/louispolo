'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ReviewsSection.tsx
// Social proof. Real names, real trip contexts, real quotes.
// Replace placeholder copy with verified customer reviews before launch.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback }  from 'react'
import { motion, AnimatePresence }           from 'framer-motion'
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react'
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
    text:    'Really impressed with the build quality. The interior compartments are well thought out and everything stays in place during travel. Looks far more premium than the price suggests. Exactly what I was looking for.',
    photos:  ['WhatsApp_Image_2026-06-21_at_02.04.32_hfq8q4.jpg','WhatsApp_Image_2026-06-21_at_02.04.32_1_i8ggxu.jpg','WhatsApp_Image_2026-06-21_at_02.04.32_2_nl3wpv.jpg'] as string[],
  },
  {
    name:    'Gurovind Sharma',
    city:    'Hyderabad',
    trip:    '',
    product: 'HexCore Office Bag',
    rating:  5,
    text:    'I travel every week for work — Delhi, Pune, Chennai, repeat. This laptop bag has been with me for 4 months now and looks brand new. Perfectly organised for my laptop and docs, and it handles daily commutes without a scratch.',
    photos:  ['WhatsApp_Image_2026-06-21_at_11.59.32_vxakr3.jpg','WhatsApp_Image_2026-06-21_at_11.59.35_1_hmuoej.jpg','WhatsApp_Image_2026-06-21_at_11.59.34_tsxhuo.jpg','WhatsApp_Image_2026-06-21_at_11.59.33_sgoybw.jpg'] as string[],
  },
  {
    name:    'Adil Ali',
    city:    'Pune',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Got this customised backpack from Louis Polo with my name engraved on it. The personalisation is clean and sharp. The bag itself feels solid and looks elegant — gets a lot of attention at the office.',
    photos:  ['WhatsApp_Image_2026-06-21_at_11.59.22_1_zcuvhk.jpg','WhatsApp_Image_2026-06-21_at_11.59.22_pzqhxk.jpg'] as string[],
  },
  {
    name:    'Fatima Sheikh',
    city:    'Ahmedabad',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Gifted the Set of 3 to my parents for their Umrah trip. They were thrilled with how light yet strong the bags are. Checked in without any issues at Mumbai airport. A very thoughtful gift that actually performed.',
    photos:  [] as string[],
  },
  {
    name:    'Sneha Iyer',
    city:    'Chennai',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Clean design, smooth zippers, and the hard shell held up perfectly on my Goa trip. Looks far more expensive than it is. Really happy with the quality — will be ordering another colour soon.',
    photos:  ['WhatsApp_Image_2026-06-21_at_11.59.27_unigr1.jpg'] as string[],
  },
  {
    name:    'Arun Pillai',
    city:    'Kochi',
    trip:    '',
    product: '',
    rating:  5,
    text:    'Picked this up as a gym and weekend bag. Roomy compartments, sturdy zippers, and it holds its shape well even when packed full. Looks great and feels built to last. Very happy with the purchase.',
    photos:  ['WhatsApp_Image_2026-06-21_at_11.59.28_usgque.jpg'] as string[],
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

function Lightbox({
  photos,
  index,
  reviewName,
  onClose,
  onPrev,
  onNext,
}: {
  photos: string[]
  index: number
  reviewName: string
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}) {
  const src = cld(photos[index], 'f_auto,q_90,w_900,h_900,c_pad,b_rgb:F5F3ED')
  const multi = photos.length > 1

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft')  onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrev, onNext])

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
            key={index}
            src={src}
            alt={`${reviewName} photo ${index + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 90vw, 448px"
          />

          {multi && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); onPrev() }}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                aria-label="Previous"
              >
                <ChevronLeft size={18} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onNext() }}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/70 transition-colors"
                aria-label="Next"
              >
                <ChevronRight size={18} strokeWidth={1.5} />
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {photos.map((_, i) => (
                  <span
                    key={i}
                    className={`block w-1.5 h-1.5 rounded-full transition-colors ${i === index ? 'bg-white' : 'bg-white/40'}`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export function ReviewsSection() {
  const [lightbox, setLightbox] = useState<{ photos: string[]; index: number; reviewName: string } | null>(null)

  const handlePrev = useCallback(() =>
    setLightbox(lb => lb && { ...lb, index: (lb.index - 1 + lb.photos.length) % lb.photos.length }), [])
  const handleNext = useCallback(() =>
    setLightbox(lb => lb && { ...lb, index: (lb.index + 1) % lb.photos.length }), [])

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
              4.7 ★ · 1200+ verified buyers
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
                        onClick={() => setLightbox({ photos: review.photos, index: i, reviewName: review.name })}
                        className="relative shrink-0 w-24 h-24 rounded-sm overflow-hidden bg-[var(--color-lp-porcelain)] cursor-zoom-in hover:opacity-90 transition-opacity"
                      >
                        <Image
                          src={cld(pid, 'f_auto,q_80,w_200,h_200,c_pad,b_rgb:F5F3ED')}
                          alt={`${review.name} photo ${i + 1}`}
                          fill
                          className="object-contain"
                          sizes="96px"
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
          photos={lightbox.photos}
          index={lightbox.index}
          reviewName={lightbox.reviewName}
          onClose={() => setLightbox(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </>
  )
}
