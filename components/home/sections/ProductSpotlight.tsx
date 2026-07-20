'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ProductSpotlight.tsx
// "A closer look" — product demonstration videos on the homepage, shown as a
// carousel of TV mockups. One slide = one complete TV (screen + stand +
// caption); swipe/scroll between products. Only the visible slide's video
// autoplays — every other slide's video is paused, so only one thing is ever
// moving on screen at once.
//
// VIDEO: upload your demo video to Cloudinary (as a VIDEO asset), then paste
// its public_id into a SPOTLIGHTS entry below. The poster frame is pulled
// from the video automatically; set posterId to a Cloudinary IMAGE public_id
// if you want a custom thumbnail instead. Leave videoId blank for a
// "video coming soon" placeholder slide.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useState } from 'react'
import { motion }           from 'framer-motion'
import { Play }             from 'lucide-react'
import { cldVideo, videoPosterUrl, cld } from '@/lib/cloudinary'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

interface SpotlightItem {
  videoId:  string   // Cloudinary VIDEO public_id (no extension); blank = placeholder
  posterId: string   // optional custom thumbnail (IMAGE public_id); blank = video's first frame
  copy:     string
}

const SPOTLIGHTS: SpotlightItem[] = [
  {
    videoId:  'Trimmed_and_Audio_Removed_keanoc',
    posterId: '',
    copy:     'Every pocket, zip, and strap. See exactly what arrives at your door.',
  },
  {
    videoId:  '',
    posterId: '',
    copy:     'Built the same way, piece by piece.',
  },
]

const HEADER = {
  eyebrow: 'A closer look',
  heading: 'See it the way you will use it.',
}

// ─── One TV: screen + stand + caption, with its own play-when-visible video ──
function SpotlightTV({ item }: { item: SpotlightItem }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {})
        else vid.pause()
      },
      { threshold: 0.6 }
    )
    io.observe(vid)
    return () => io.disconnect()
  }, [])

  const hasVideo = item.videoId !== ''
  const poster = hasVideo
    ? item.posterId
      ? cld(item.posterId, 'f_auto,q_auto,w_1280')
      : videoPosterUrl(item.videoId)
    : undefined

  return (
    <div className="w-full shrink-0 snap-center px-1">
      <div className="relative w-full max-w-5xl mx-auto aspect-video bg-lp-cream overflow-hidden rounded-md border-[1.5px] border-[#5B6670]">
        {hasVideo ? (
          <video
            ref={videoRef}
            src={cldVideo(item.videoId)}
            poster={poster}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-lp-border">
            <span className="w-14 h-14 rounded-full border-[1.5px] border-lp-faint flex items-center justify-center">
              <Play size={20} strokeWidth={1.5} className="text-lp-faint ml-0.5" />
            </span>
            <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-lp-faint">
              Video coming soon
            </p>
          </div>
        )}
      </div>

      {/* Monitor stand — neck + base, makes the video read as a TV screen */}
      <div aria-hidden>
        <div
          className="mx-auto w-20 md:w-24 h-7 md:h-9 bg-[#5B6670]"
          style={{ clipPath: 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)' }}
        />
        <div className="mx-auto w-44 md:w-56 h-1.5 rounded-full bg-[#5B6670]" />
      </div>

      <p className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl mx-auto mt-6 md:mt-8 text-center">
        {item.copy}
      </p>
    </div>
  )
}

export function ProductSpotlight() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  function handleScroll() {
    const track = trackRef.current
    if (!track) return
    const index = Math.round(track.scrollLeft / track.clientWidth)
    setActiveIndex(index)
  }

  function scrollToIndex(index: number) {
    const track = trackRef.current
    if (!track) return
    track.scrollTo({ left: index * track.clientWidth, behavior: 'smooth' })
  }

  return (
    <section className="section-pad" style={{ paddingTop: '1.5rem', paddingBottom: '2rem' }}>
      <div className="container-lp">

        {/* Header */}
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
          className="mb-8 md:mb-10 text-center"
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            {HEADER.eyebrow}
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            {HEADER.heading}
          </motion.h2>
        </motion.div>

        {/* Carousel — one full TV per slide, native scroll-snap */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide"
          >
            {SPOTLIGHTS.map((item, i) => (
              <SpotlightTV key={i} item={item} />
            ))}
          </div>

          {/* Dots — only shown when there's more than one product to switch between */}
          {SPOTLIGHTS.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              {SPOTLIGHTS.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  aria-label={`Show product ${i + 1}`}
                  aria-current={activeIndex === i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? 'w-6 bg-lp-ink' : 'w-1.5 bg-lp-border-strong'
                  }`}
                />
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
