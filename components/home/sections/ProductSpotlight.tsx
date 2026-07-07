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

import { useRef, useState } from 'react'
import { motion }           from 'framer-motion'
import { Play }             from 'lucide-react'
import { cldVideo, videoPosterUrl, cld } from '@/lib/cloudinary'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

const SPOTLIGHT = {
  videoId:  '',   // ← Cloudinary VIDEO public_id, e.g. 'backpack-demo_abc123'
  posterId: '',   // optional custom thumbnail (IMAGE public_id); blank = video's first frame
  eyebrow:  'A closer look',
  heading:  'Our backpack, up close.',
  copy:     'Every pocket, zip, and strap. See exactly what arrives at your door.',
}

export function ProductSpotlight() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)

  function handlePlay() {
    setPlaying(true)
    videoRef.current?.play()
  }

  const hasVideo = SPOTLIGHT.videoId !== ''
  const poster = hasVideo
    ? SPOTLIGHT.posterId
      ? cld(SPOTLIGHT.posterId, 'f_auto,q_auto,w_1280')
      : videoPosterUrl(SPOTLIGHT.videoId)
    : undefined

  return (
    <section className="section-pad" style={{ paddingTop: '1.5rem' }}>
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
          <motion.p
            variants={fadeUp}
            className="font-body text-[0.9rem] text-lp-muted leading-relaxed max-w-xl mx-auto mt-3"
          >
            {SPOTLIGHT.copy}
          </motion.p>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative max-w-4xl mx-auto aspect-video bg-lp-cream overflow-hidden rounded-md"
        >
          {hasVideo ? (
            <>
              <video
                ref={videoRef}
                src={cldVideo(SPOTLIGHT.videoId)}
                poster={poster}
                controls={playing}
                playsInline
                preload="metadata"
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => setPlaying(false)}
              />
              {!playing && (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="absolute inset-0 flex items-center justify-center group cursor-pointer"
                  aria-label="Play product demonstration video"
                >
                  <span className="absolute inset-0 bg-lp-ink/20 group-hover:bg-lp-ink/30 transition-colors duration-300" />
                  <span className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-lp-porcelain/95 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                    <Play size={26} strokeWidth={1.5} className="text-lp-ink ml-1" fill="var(--color-lp-ink)" />
                  </span>
                </button>
              )}
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
      </div>
    </section>
  )
}
