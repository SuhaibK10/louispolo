'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/HeroSection.tsx
// Full viewport hero — 3-4 Cloudinary images auto-sliding every 4s.
// FlapText cycles destination headlines. Scroll indicator bounces below.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { useRouter }                         from 'next/navigation'
import { motion, AnimatePresence }           from 'framer-motion'
import { ArrowRight }                        from 'lucide-react'
import { HERO_SLIDES }                       from '@/config/products'
import { heroUrl, heroUrlMobile, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import { ROUTES }                            from '@/lib/constants'

const SLIDE_DURATION = 3500  // ms between auto-advances

// Rotation is back on, but per Suhaib's request only the first 2 slides in
// HERO_SLIDES are live for now — the rest of the array stays put, ready to
// go live again by raising this back to HERO_SLIDES.length (or removing
// the slice below entirely).
const HERO_SLIDE_LIMIT = 2

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
                delay:    (wi * word.length + ci) * 0.035,
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
  const router = useRouter()
  const slides = HERO_SLIDES.slice(0, HERO_SLIDE_LIMIT)
  const [current, setCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)
  const touchStartX = useRef<number>(0)
  const touchEndX = useRef<number>(0)
  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length)
  }, [slides.length])

  // Pause auto-advance once the hero scrolls out of view, so it isn't
  // re-animating (FlapText + crossfade) somewhere the user can't see.
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX
    const delta = touchStartX.current - touchEndX.current
    if (Math.abs(delta) < 40) return
    if (delta > 0) {
      setCurrent(c => (c + 1) % slides.length)
    } else {
      setCurrent(c => (c - 1 + slides.length) % slides.length)
    }
    setIsPlaying(false)
    setTimeout(() => setIsPlaying(true), SLIDE_DURATION)
  }

  // Auto-advance
  useEffect(() => {
    if (!isPlaying || !isVisible) return
    const id = setInterval(next, SLIDE_DURATION)
    return () => clearInterval(id)
  }, [isPlaying, isVisible, next])

  const slide = slides[current]

  return (
    <section
      id="hero-section"
      ref={sectionRef}
      className="relative h-[calc(88svh-1.75rem)] md:h-[calc(96vh-1.75rem)] md:min-h-150 md:max-h-240 overflow-hidden cursor-pointer"
      onClick={() => router.push(ROUTES.shop)}
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
              {/* Mobile/tablet portrait (incl. iPad): full natural portrait, no pre-crop — hidden on lg+ */}
              <Image
                src={heroUrlMobile(slide.image) || PLACEHOLDER_URL}
                alt={slide.headline ?? 'Louis Polo luggage'}
                fill
                priority={current === 0}
                loading={current === 0 ? 'eager' : 'lazy'}
                className="object-cover block lg:hidden"
                style={{ objectPosition: slide.mobileObjectPosition ?? 'center' }}
                sizes="(max-width: 1023px) 100vw, 1px"
              />
              {/* Desktop: separate 16:9 image if provided, else same image with landscape crop.
                  No `priority` here — it forces an unconditional preload that ignores the
                  `hidden lg:block` CSS, so both breakpoint variants used to download on every
                  load regardless of viewport. Left as native lazy-load, which correctly skips
                  fetching a display:none image. */}
              <Image
                src={heroUrl(slide.desktopImage ?? slide.image) || PLACEHOLDER_URL}
                alt={slide.headline ?? 'Louis Polo luggage'}
                fill
                className="object-cover hidden lg:block"
                style={{ objectPosition: slide.desktopObjectPosition ?? 'center' }}
                sizes="(max-width: 1023px) 1px, 100vw"
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
            className={`${slide.textSize === 'md' ? 'lp-heading-md' : slide.textSize === 'lg' ? 'lp-heading-lg' : 'lp-heading-xl'} mb-3`}
            style={{
              width: '100%',
              textAlign: 'center',
              ...(slide.textStyle === 'dark'
                ? { color: 'var(--color-lp-ink)' }
                : slide.textStyle === 'shadow'
                ? { color: 'var(--color-lp-porcelain)', textShadow: '0 2px 16px rgba(0,0,0,0.65)' }
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
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0,  scale: 1    }}
              transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.4 }}
              className="flex flex-wrap gap-3 justify-center w-full"
            >
              <Link href={`${ROUTES.shop}?category=vanity`} className="btn-primary">
                Explore the Collection
                <ArrowRight size={16} strokeWidth={1.5} />
              </Link>
            </motion.div>
          )}
        </div>

        {/* ── Slide indicators — hidden entirely while locked to one slide ── */}
        {slides.length > 1 && (
        <div className="absolute bottom-8 right-6 md:right-12 flex gap-2 z-20">
          {slides.map((_, i) => (
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
        )}
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      
    </section>
  )
}
