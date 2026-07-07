'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/ProductSpotlight.tsx
// "A closer look" — product demonstration video on the homepage.
//
// VIDEO: upload your demo video to Cloudinary (as a VIDEO asset), then paste
// its public_id into SPOTLIGHT.videoId below. The poster frame is pulled from
// the video automatically; set posterId to a Cloudinary IMAGE public_id if you
// want a custom thumbnail instead.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect } from 'react'
import { motion }           from 'framer-motion'
import { Play }             from 'lucide-react'
import { cldVideo, videoPosterUrl, cld } from '@/lib/cloudinary'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

const SPOTLIGHT = {
  videoId:  'Trimmed_and_Audio_Removed_keanoc',   // ← Cloudinary VIDEO public_id (no file extension)
  posterId: '',   // optional custom thumbnail (IMAGE public_id); blank = video's first frame
  eyebrow:  'A closer look',
  heading:  'See it the way you will use it.',
  copy:     'Every pocket, zip, and strap. See exactly what arrives at your door.',
}

export function ProductSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null)

  // Autoplay when the section scrolls into view, pause when it leaves
  useEffect(() => {
    const vid = videoRef.current
    if (!vid) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) vid.play().catch(() => {})
        else vid.pause()
      },
      { threshold: 0.35 }
    )
    io.observe(vid)
    return () => io.disconnect()
  }, [])

  const hasVideo = SPOTLIGHT.videoId !== ''
  const poster = hasVideo
    ? SPOTLIGHT.posterId
      ? cld(SPOTLIGHT.posterId, 'f_auto,q_auto,w_1280')
      : videoPosterUrl(SPOTLIGHT.videoId)
    : undefined

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
            {SPOTLIGHT.eyebrow}
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            {SPOTLIGHT.heading}
          </motion.h2>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative w-full max-w-5xl mx-auto aspect-video bg-lp-cream overflow-hidden rounded-md"
        >
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={cldVideo(SPOTLIGHT.videoId)}
                poster={poster}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </>
          ) : (
            /* Placeholder until the video is uploaded */
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 border border-lp-border">
              <span className="w-14 h-14 rounded-full border-[1.5px] border-lp-faint flex items-center justify-center">
                <Play size={20} strokeWidth={1.5} className="text-lp-faint ml-0.5" />
              </span>
              <p className="font-body text-[0.7rem] tracking-[0.14em] uppercase text-lp-faint">
                Video coming soon
              </p>
            </div>
          )}
        </motion.div>

        {/* Copy — below the video */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl mx-auto mt-6 md:mt-8 text-center"
        >
          {SPOTLIGHT.copy}
        </motion.p>
      </div>
    </section>
  )
}
