'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ImageGallery.tsx
// Product detail image gallery — main image + thumbnail strip.
// Swipe-friendly on mobile (drag between images).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect }       from 'react'
import Image                        from 'next/image'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { pdpUrl, thumbUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'

interface Props {
  images: string[]
  productName: string
  activeColorIndex?: number
}

export function ImageGallery({ images, productName, activeColorIndex }: Props) {
  const [active, setActive]           = useState(activeColorIndex ?? 0)
  const [imageLoaded, setImageLoaded] = useState(false)

  useEffect(() => {
    if (activeColorIndex !== undefined) setActive(activeColorIndex)
  }, [activeColorIndex])

  useEffect(() => {
    setImageLoaded(false)
  }, [active])

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info
    if (offset.x < -50 || velocity.x < -400) {
      setActive((a) => Math.min(a + 1, images.length - 1))
    } else if (offset.x > 50 || velocity.x > 400) {
      setActive((a) => Math.max(a - 1, 0))
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — drag left/right to slide between images */}
      <motion.div
        className="relative aspect-3/4 bg-lp-cream overflow-hidden touch-pan-y select-none"
        drag={images.length > 1 ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, x: 16 }}
            animate={imageLoaded ? { opacity: 1, x: 0 } : { opacity: 0, x: 16 }}
            exit={{    opacity: 0, x: -8 }}
            transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={pdpUrl(images[active]) || PLACEHOLDER_URL}
              alt={`${productName}, view ${active + 1}`}
              fill
              priority
              draggable={false}
              onLoad={() => setImageLoaded(true)}
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative shrink-0 w-16 h-21.25 overflow-hidden bg-lp-cream border transition-colors duration-200 ${
                i === active
                  ? 'border-lp-gold shadow-[inset_0_0_0_1px_var(--color-lp-gold)]'
                  : 'border-lp-border hover:border-lp-border-strong'
              }`}
              aria-label={`View image ${i + 1}`}
              aria-pressed={i === active}
            >
              <Image
                src={thumbUrl(img) || PLACEHOLDER_URL}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover object-center"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
