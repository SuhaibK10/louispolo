'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ImageGallery.tsx
// Product detail image gallery — main image + thumbnail strip.
// Swipe-friendly on mobile (drag between images).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect }       from 'react'
import Image                        from 'next/image'
import { motion, AnimatePresence }  from 'framer-motion'
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

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-3/4 bg-lp-cream overflow-hidden">
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
              onLoad={() => setImageLoaded(true)}
              className="object-cover object-center"
              sizes="(max-width:768px) 100vw, 50vw"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="relative shrink-0 w-16 h-21.25 overflow-hidden transition-all duration-200"
              style={{
                outline: i === active
                  ? '1.5px solid var(--color-lp-gold)'
                  : '1.5px solid var(--color-lp-border)',
                outlineOffset: '1.5px',
              }}
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
