'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/HeroSection.tsx
// Full viewport hero — 3-4 Cloudinary images auto-sliding every 4s.
// FlapText cycles destination headlines. Scroll indicator bounces below.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion, AnimatePresence }           from 'framer-motion'
import { ArrowRight, ChevronDown }           from 'lucide-react'
import { HERO_SLIDES }                       from '@/config/products'
import { heroUrl, heroUrlMobile, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { ROUTES }                            from '@/lib/constants'

const SLIDE_DURATION = 4500  // ms between auto-advances

// ─── FlapText: splits each word into characters that flip like departure boards
function FlapText({ text }: { text: string }) {
  return (
    <span className="inline-flex flex-wrap gap-x-[0.25em]">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-flex overflow-hidden">
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0,   opacity: 1 }}
              transition={{
                duration: 0.35,
                delay:    (wi * word.length + ci) * 0.028,
                ease:     [0.16, 1, 0.3, 1],
              }}
              className="inline-block"
              style={{ transformOrigin: 'center bottom' }}
            >
              {char}
            </motion.span>
          ))}
        </span>
      ))}
    </span>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function HeroSection() {
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % HERO_SLIDES.length)
  }, [])

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [isPlaying, next])

  const slide = HERO_SLIDES[current]

  return (
    <section
      className="relative h-[85svh] md:h-screen md:min-h-150 md:max-h-240 overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* ── Slides ───────────────────────────────────────────────────────── */}
      <AnimatePresence mode="sync">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1,  scale: 1    }}
          exit={{    opacity: 0,  scale: 0.98 }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0"
        >
          {/* Mobile: full natural portrait, no pre-crop — hidden on md+ */}
          <Image
            src={heroUrlMobile(slide.image) || PLACEHOLDER_URL}
            alt={slide.headline ?? 'Louis Polo luggage'}
            fill
            priority={current === 0}
            className="object-cover object-center block md:hidden"
            sizes="(max-width: 767px) 100vw, 1px"
          />
          {/* Desktop: 16:9 landscape crop — hidden below md */}
          <Image
              src={heroUrl(slide.image) || PLACEHOLDER_URL}
              alt={slide.headline ?? 'Louis Polo luggage'}
              fill
              priority={current === 0}
              loading="eager"
              className="object-cover object-center hidden md:block"
              sizes="100vw"
            />

          {/* Gradient overlay — bottom heavy so text reads cleanly */}
         <div className="absolute inset-0 bg-gradient-to-t from-[#1A1714]/40 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-20 md:pb-24">
        <div className="container-lp">

          

          {/* FlapText headline — re-mounts on each slide change */}
          <h1 className="lp-heading-xl text-[var(--color-lp-porcelain)] mb-3 max-w-[14ch]">
            <AnimatePresence mode="wait">
              <FlapText
                key={`headline-${current}`}
                text={slide.headline ?? ''}
              />
            </AnimatePresence>
          </h1>

          {/* Subline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={`sub-${current}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{    opacity: 0       }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="font-body text-[var(--color-lp-porcelain)]/70 text-base md:text-lg mb-8 max-w-[36ch]"
            >
              {slide.subline}
            </motion.p>
          </AnimatePresence>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-3"
          >
            
            
          </motion.div>
        </div>

        {/* ── Slide indicators ─────────────────────────────────────────── */}
        <div className="absolute bottom-8 right-6 md:right-12 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrent(i); setIsPlaying(false) }}
              className="relative h-[2px] overflow-hidden transition-all duration-300"
              style={{ width: i === current ? '2rem' : '0.75rem' }}
              aria-label={`Slide ${i + 1}`}
            >
              <span className="absolute inset-0 bg-white/30" />
              {i === current && (
                <motion.span
                  className="absolute inset-0 bg-[var(--color-lp-gold)] origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: SLIDE_DURATION / 1000, ease: 'linear' }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20"
      >
        <span className="font-body text-[0.6rem] tracking-[0.2em] uppercase text-white/40">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
        >
          <ChevronDown size={16} strokeWidth={1.5} className="text-white/40" />
        </motion.div>
      </motion.div>
    </section>
  )
}
