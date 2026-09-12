'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/CommunityShowcase.tsx
// "By Our Community" — a UGC video carousel, styled after the reference
// (center clip enlarged and fully opaque, neighbors scaled down and dimmed).
// Native scroll-snap drives it (touch swipe works for free); the arrow
// buttons and active-state styling ride on top via IntersectionObserver,
// which is what keeps `active` correct even when someone swipes by hand
// instead of clicking an arrow.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Play, Instagram } from 'lucide-react'
import { BRAND } from '@/lib/constants'
import { cfVideo, cfVideoPoster } from '@/lib/cloudflareStream'
import { COMMUNITY_CLIPS } from '@/config/communityShowcase'
import { tapPunch } from '@/lib/animations'

export function CommunityShowcase() {
  const middleIndex = Math.floor((COMMUNITY_CLIPS.length - 1) / 2)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const [active, setActive] = useState(middleIndex)
  const [playing, setPlaying] = useState<number | null>(null)

  const handle = BRAND.instagram.split('/').filter(Boolean).pop()

  // Center the middle card immediately on mount (no animation, no visible
  // scroll-into-place) so the carousel opens on the "peek both sides" look
  // from the start, instead of starting scrolled all the way to card 0.
  useEffect(() => {
    cardRefs.current[middleIndex]?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const i = cardRefs.current.findIndex((el) => el === entry.target)
          if (i !== -1) setActive(i)
        })
      },
      { root: track, threshold: 0.6 }
    )
    cardRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [])

  function scrollToIndex(i: number) {
    const clamped = Math.max(0, Math.min(COMMUNITY_CLIPS.length - 1, i))
    cardRefs.current[clamped]?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  }

  return (
    <section className="section-pad bg-[var(--color-lp-cream)] overflow-hidden">
      {/* Hidden gradient def — Lucide's Instagram icon is plain line art with
          no color of its own, so its brand gradient is defined once here and
          referenced via stroke="url(#...)" below. */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          <linearGradient id="instagram-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#feda75" />
            <stop offset="25%"  stopColor="#fa7e1e" />
            <stop offset="50%"  stopColor="#d62976" />
            <stop offset="75%"  stopColor="#962fbf" />
            <stop offset="100%" stopColor="#4f5bd5" />
          </linearGradient>
        </defs>
      </svg>

      <div className="container-lp text-center mb-8 md:mb-10">
        <a
          href={BRAND.instagram}
          target="_blank"
          rel="noreferrer"
          className="lp-eyebrow inline-flex items-center gap-1.5 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
        >
          <Instagram size={13} strokeWidth={1.75} stroke="url(#instagram-gradient)" />
          @{handle}
        </a>
        <h2 className="lp-heading-lg mt-1">By Our Community</h2>
        <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)] mt-2">
          Tag us at @{handle} and get featured in this gallery!
        </p>
      </div>

      <div className="relative">
        <motion.button
          type="button"
          onClick={() => scrollToIndex(active - 1)}
          disabled={active === 0}
          whileTap={tapPunch}
          aria-label="Previous"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <ChevronLeft size={18} strokeWidth={1.75} />
        </motion.button>
        <motion.button
          type="button"
          onClick={() => scrollToIndex(active + 1)}
          disabled={active === COMMUNITY_CLIPS.length - 1}
          whileTap={tapPunch}
          aria-label="Next"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
        >
          <ChevronRight size={18} strokeWidth={1.75} />
        </motion.button>

        <div
          ref={trackRef}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-[calc(50%-8.5rem)] md:px-[calc(50%-10rem)]"
        >
          {COMMUNITY_CLIPS.map((clip, i) => {
            const isActive = i === active
            const isPlaying = playing === i
            return (
              <div
                key={clip.videoId}
                ref={(el) => { cardRefs.current[i] = el }}
                onClick={() => {
                  if (!isActive) { scrollToIndex(i); return }
                  setPlaying(isPlaying ? null : i)
                }}
                className="relative shrink-0 snap-center w-68 md:w-80 aspect-[9/16] rounded-2xl overflow-hidden bg-lp-image-bg cursor-pointer transition-[transform,opacity] duration-300 ease-out"
                style={{ transform: isActive ? 'scale(1)' : 'scale(0.88)', opacity: isActive ? 1 : 0.45 }}
              >
                {isPlaying ? (
                  <video
                    src={cfVideo(clip.videoId)}
                    autoPlay
                    controls
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Image
                      src={cfVideoPoster(clip.videoId)}
                      alt={clip.caption}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width:768px) 70vw, 320px"
                    />
                    <div className="absolute inset-0 bg-[var(--color-lp-ink)]/20" />
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="w-12 h-12 rounded-full bg-[var(--color-lp-porcelain)]/90 backdrop-blur-sm flex items-center justify-center">
                        <Play size={18} strokeWidth={0} fill="currentColor" className="text-[var(--color-lp-ink)] ml-0.5" />
                      </span>
                    </span>
                    {clip.duration && (
                      <span className="absolute bottom-2.5 right-2.5 font-body text-[0.65rem] text-white/90 tabular-nums">
                        {clip.duration}
                      </span>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
