'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/about/FactoryGallery.tsx
// Behind the scenes — factory floor, QC, and dispatch photos on the About page.
// Photos come from config/factory.ts. Same drag pattern as ExhibitionGallery.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect } from 'react'
import Image                           from 'next/image'
import { motion }                      from 'framer-motion'
import { ArrowLeft }                   from 'lucide-react'
import { FACTORY_PHOTOS }              from '@/config/factory'
import { cld, PLACEHOLDER_URL }        from '@/lib/cloudinary'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

export function FactoryGallery() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)

  useEffect(() => {
    const calculate = () => {
      if (trackRef.current && containerRef.current) {
        setDragWidth(trackRef.current.scrollWidth - containerRef.current.offsetWidth)
      }
    }
    if (!trackRef.current) return
    const ro = new ResizeObserver(calculate)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  if (FACTORY_PHOTOS.length === 0) return null

  return (
    <section className="section-pad overflow-hidden">
      <div className="container-lp">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            Behind the scenes
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg mb-2">
            From our factory floor to your doorstep.
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl"
          >
            Every bag is built, checked, and dispatched from our own facility.
            No outsourcing, no mystery, this is where your luggage comes from.
          </motion.p>
        </motion.div>
      </div>

      <div ref={containerRef} className="overflow-hidden w-full pt-6 md:pt-9">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragMomentum={true}
          className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitUserSelect: 'none' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {FACTORY_PHOTOS.map((photo, i) => (
            <div
              key={`${photo.publicId}-${i}`}
              className="relative flex-shrink-0 w-[84vw] sm:w-[62vw] md:w-[38vw] lg:w-[30rem] aspect-[4/3] bg-[var(--color-lp-cream)] overflow-hidden rounded-md"
            >
              <Image
                src={
                  photo.publicId
                    ? cld(
                        photo.publicId,
                        photo.fit === 'pad'
                          ? 'f_auto,q_auto,w_1200,h_900,c_pad,b_rgb:EDE9E1'
                          : 'f_auto,q_auto,w_1200,h_900,c_fill,g_auto'
                      )
                    : PLACEHOLDER_URL
                }
                alt={photo.alt}
                fill
                draggable="false"
                className={photo.fit === 'pad' ? 'object-contain' : 'object-cover object-center'}
                sizes="(max-width:768px) 92vw, (max-width:1024px) 46vw, 30rem"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1A1714]/70 via-[#1A1714]/15 to-transparent">
                <p className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-porcelain)]">
                  {photo.caption}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Swipe hint */}
      {FACTORY_PHOTOS.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="container-lp flex items-center justify-center gap-2"
          style={{ marginTop: '0.75rem' }}
        >
          <motion.div
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ArrowLeft size={13} strokeWidth={1.5} className="text-lp-faint" />
          </motion.div>
          <span className="font-body text-[0.6rem] tracking-[0.16em] uppercase text-lp-faint">
            Swipe to explore
          </span>
        </motion.div>
      )}
    </section>
  )
}
