'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/HeroSection.tsx
// Full viewport hero — 3-4 Cloudinary images auto-sliding every 4s.
// FlapText cycles destination headlines. Scroll indicator bounces below.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion, AnimatePresence }           from 'framer-motion'
import { ArrowRight }                        from 'lucide-react'
import { HERO_SLIDES }                       from '@/config/products'
import { heroUrl, heroUrlMobile, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { ROUTES }                            from '@/lib/constants'

const SLIDE_DURATION = 30000  // ms between auto-advances

// ─── FlapText: splits each word into characters that flip like departure boards
function FlapText({ text }: { text: string }) {
  return (
    <span className="flex flex-wrap justify-center gap-x-[0.25em]">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-flex overflow-hidden pb-1">
          {word.split('').map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ rotateX: -90, opacity: 0 }}
              animate={{ rotateX: 0,   opacity: 1 }}
              transition={{
                duration: 0.55,
                delay:    (wi * word.length + ci) * 0.045,
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
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % HERO_SLIDES.length)
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) < 40) return
    if (delta > 0) {
      setCurrent(c => (c + 1) % HERO_SLIDES.length)
    } else {
      setCurrent(c => (c - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
    }
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), SLIDE_DURATION)
  }

  // Auto-advance
  useEffect(() => {
    if (!isPlaying) return
    const id = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [isPlaying, next])

  const slide = HERO_SLIDES[current]

  return (
    <section
      id="hero-section"
      className="relative h-[85svh] md:h-screen md:min-h-150 md:max-h-240 overflow-hidden"
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
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
          {slide.isVideo ? (
            <video
              src={slide.image}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <>
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
            </>
          )}

        </motion.div>
      </AnimatePresence>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div
        className="relative z-10 h-full flex flex-col"
        style={{
          justifyContent: slide.textPosition === 'top' ? 'flex-start' : slide.textPosition === 'center' ? 'center' : 'flex-end',
          paddingTop:     slide.textPosition === 'top' ? `${slide.textOffset ?? 5}rem` : undefined,
          paddingBottom:  slide.textPosition !== 'top' ? `${slide.textOffset ?? 2.5}rem` : undefined,
        }}
      >
        <div className="container-lp">

          {/* FlapText headline — re-mounts on each slide change */}
          <h1
            className="lp-heading-xl mb-3"
            style={{
              width: '100%',
              textAlign: 'center',
              ...(slide.textStyle === 'dark'
                ? { color: 'var(--color-lp-ink)' }
                : slide.textStyle === 'shadow'
                ? { color: 'var(--color-lp-porcelain)', textShadow: '0 2px 16px rgba(0,0,0,0.65)' }
                : slide.textStyle === 'gold'
                ? { color: 'var(--color-lp-gold)' }
                : slide.textStyle === 'teal'
                ? {
                    background: 'linear-gradient(135deg, #237A6E 0%, #2C9E8F 40%, #38A99A 50%, #2C9E8F 60%, #237A6E 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }
                : { color: 'var(--color-lp-porcelain)' }),
            }}
          >
            {slide.textStyle === 'pill' ? (
              <span className="inline-block bg-black/30 backdrop-blur-sm px-4 py-1 rounded-sm">
                <AnimatePresence mode="wait">
                  <FlapText key={`headline-${current}`} text={slide.headline ?? ''} />
                </AnimatePresence>
              </span>
            ) : (
              <AnimatePresence mode="wait">
                <FlapText key={`headline-${current}`} text={slide.headline ?? ''} />
              </AnimatePresence>
            )}
          </h1>

          {/* Subline */}
          {slide.subline && (
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${current}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{    opacity: 0       }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="font-body text-lp-porcelain/70 text-base md:text-lg mb-8 max-w-[36ch] w-full text-center"
              >
                {slide.subline}
              </motion.p>
            </AnimatePresence>
          )}

          {/* CTAs — only shown when slide opts in */}
          {slide.showCta && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center w-full"
            >
              <Link href={ROUTES.shop} className="btn-primary">
                Shop the Collection
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── Slide indicators ─────────────────────────────────────────── */}
        <div className="absolute bottom-8 right-6 md:right-12 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrent(i)
                setIsPlaying(false)
                setTimeout(() => setIsPlaying(true), SLIDE_DURATION)
              }}
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
      
    </section>
  )
}
