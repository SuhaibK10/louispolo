'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ExhibitionGallery.tsx
// Trade show presence — drag-to-scroll photo carousel grouped by exhibition.
// Same drag pattern as BestSellersCarousel for interaction consistency.
// Rendered on both the homepage (HomeEditorial) and the About page.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect } from 'react'
import Image                           from 'next/image'
import { motion }                      from 'framer-motion'
import { MapPin }                      from 'lucide-react'
import { EXHIBITIONS }                 from '@/config/exhibitions'
import { expoUrl, PLACEHOLDER_URL }    from '@/lib/cloudinary'
import { cn }                          from '@/lib/utils'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

export function ExhibitionGallery() {
  const [activeId, setActiveId] = useState(EXHIBITIONS[0]?.id)
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)

  const active = EXHIBITIONS.find(e => e.id === activeId) ?? EXHIBITIONS[0]

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
  }, [activeId])

  if (!active) return null

  return (
    <section className="section-pad overflow-hidden bg-lp-ink" style={{ paddingTop: '2.5rem' }}>
      <div className="container-lp">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            Where we show up
          </motion.span>
          <motion.h2
            variants={fadeUp}
            className="lp-heading-lg mb-6"
            style={{ color: 'var(--color-lp-porcelain)' }}
          >
            We Exhibit. <br/> The World sees it.
          </motion.h2>
        </motion.div>

        {EXHIBITIONS.length > 1 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {EXHIBITIONS.map((ex) => (
              <button
                key={ex.id}
                onClick={() => setActiveId(ex.id)}
                className={cn(
                  'font-body text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-200',
                  ex.id === active.id
                    ? 'bg-lp-gold text-lp-ink border-lp-gold'
                    : 'bg-transparent text-lp-porcelain/50 border-lp-porcelain/20 hover:border-lp-porcelain hover:text-lp-porcelain'
                )}
              >
                {ex.city}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={containerRef} className="overflow-hidden w-full pt-4 md:pt-14">
        <motion.div
          key={active.id}
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragMomentum={true}
          className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitUserSelect: 'none' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {active.photos.map((photo, i) => (
            <div
              key={`${photo.publicId}-${i}`}
              className="relative flex-shrink-0 w-[92vw] sm:w-[70vw] md:w-[34vw] lg:w-[34rem] aspect-[3/4] bg-[var(--color-lp-cream)] overflow-hidden"
            >
              <Image
                src={expoUrl(photo.publicId) || PLACEHOLDER_URL}
                alt={photo.alt}
                fill
                draggable="false"
                className="object-cover object-center"
                sizes="(max-width:768px) 92vw, (max-width:1024px) 46vw, 34rem"
              />
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#1A1714]/80 via-[#1A1714]/20 to-transparent">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <MapPin size={12} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
                  <span className="font-display text-[1rem] text-[var(--color-lp-porcelain)]">
                    {active.city}
                  </span>
                </div>
                <p className="font-body text-[0.7rem] text-[var(--color-lp-porcelain)]/70">
                  {active.venue} · {active.date}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
