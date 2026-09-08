'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ImageGallery.tsx
// Product detail image gallery — main image + thumbnail strip.
// Swipe-friendly on mobile (drag between images).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import Image                        from 'next/image'
import { Flame, ZoomIn, Play }      from 'lucide-react'
import { motion, AnimatePresence, type PanInfo } from 'framer-motion'
import { pdpUrl, pdpZoomUrl, thumbUrl, PLACEHOLDER_URL, type ImageFit } from '@/lib/cloudflareImages'
import { buildGallerySlides, youtubeThumbnail } from '@/lib/gallerySlides'

const LONG_PRESS_MS      = 350  // hold duration before zoom kicks in
const LONG_PRESS_SLOP_PX = 8    // movement past this before the timer fires reads as a swipe, not a hold

interface Props {
  images: string[]
  productName: string
  active: number
  onActiveChange: (index: number) => void
  recentPurchases?: number
  imageFit?: ImageFit
  videoYoutubeId?: string
}

export function ImageGallery({ images, productName, active, onActiveChange, recentPurchases, imageFit, videoYoutubeId }: Props) {
  // Photos plus, when the product has one, a video slide spliced in right
  // after the first photo — see lib/gallerySlides. `active`/`displayed`
  // index into this list, not the raw `images` array.
  const slides = buildGallerySlides(images, videoYoutubeId)
  const currentSlide = slides[active]
  const isVideoSlide = currentSlide?.type === 'video'

  // The lifestyle/cover treatment only ever applies to the first photo in
  // the array — every other angle is still a background-removed cutout
  // meant for the pad-on-flat-color default, so forcing cover-fit on those
  // would crop them wrong (no letterbox margin to protect the product).
  const fitFor = (index: number) => (index === 0 ? imageFit : undefined)
  // What's actually on screen. Kept a step behind `active` so the current
  // photo never disappears behind a blank frame while the next one is
  // still downloading — see the preload effect below.
  const [displayed, setDisplayed] = useState(active)
  const displayedSlide = slides[displayed] ?? currentSlide
  // `priority` should only ever apply to the very first image painted (it's
  // the page's LCP candidate) — not to every color swap afterwards, which
  // would otherwise mark each swapped-in image as high-priority too.
  const isFirstLoad = useRef(true)
  useEffect(() => { isFirstLoad.current = false }, [])

  // Warm the browser cache for every photo in this gallery as soon as the
  // set is known — covers both a thumbnail click (same color, different
  // angle) and a color swatch swap (a whole new `images` array arrives,
  // firing this effect again). By the time someone actually clicks, the
  // full-size image is usually already cached instead of a cold fetch.
  // The video slide has no bytes to warm — iframes load on their own.
  useEffect(() => {
    images.forEach((img, i) => {
      const preload = new window.Image()
      preload.src = pdpUrl(img, fitFor(i)) || PLACEHOLDER_URL
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images, imageFit])

  useEffect(() => {
    if (active === displayed) return
    // Video slide — nothing to preload, swap straight over.
    if (slides[active]?.type === 'video') { setDisplayed(active); return }
    let cancelled = false
    const preload = new window.Image()
    const swap = () => { if (!cancelled) setDisplayed(active) }
    preload.onload  = swap
    preload.onerror = swap
    preload.src = pdpUrl(slides[active].src, fitFor(active)) || PLACEHOLDER_URL
    if (preload.complete) swap()
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, displayed, images, imageFit, videoYoutubeId])

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info
    if (offset.x < -50 || velocity.x < -400) {
      onActiveChange(Math.min(active + 1, slides.length - 1))
    } else if (offset.x > 50 || velocity.x > 400) {
      onActiveChange(Math.max(active - 1, 0))
    }
  }

  // ── Zoom — long-press on touch, hover on desktop ────────────────────────
  const [zoomed, setZoomed]         = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const pressStart   = useRef<{ x: number; y: number } | null>(null)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function clearLongPress() {
    if (longPressTimer.current) clearTimeout(longPressTimer.current)
    longPressTimer.current = null
    pressStart.current = null
  }

  // Touch/pen only — mouse uses hover instead (below), so a click-and-hold
  // doesn't also fire this and fight with the hover state.
  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse' || isVideoSlide) return
    const rect = e.currentTarget.getBoundingClientRect()
    const originX = ((e.clientX - rect.left) / rect.width) * 100
    const originY = ((e.clientY - rect.top) / rect.height) * 100
    pressStart.current = { x: e.clientX, y: e.clientY }
    // Start fetching the high-res zoom image as soon as the press begins,
    // in parallel with the hold — by the time LONG_PRESS_MS elapses and
    // zoom actually engages, it's usually already loaded (same idea as the
    // mouseenter prefetch for desktop hover, just started earlier here
    // since a touch hold is shorter than typical hover-then-move timing).
    const preload = new window.Image()
    preload.src = displayedSlide.type === 'image' ? (pdpZoomUrl(displayedSlide.src, fitFor(displayed)) || PLACEHOLDER_URL) : PLACEHOLDER_URL
    longPressTimer.current = setTimeout(() => {
      setZoomOrigin({ x: originX, y: originY })
      setZoomed(true)
    }, LONG_PRESS_MS)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
    // Already zoomed (touch) — track the finger to pan the magnified view,
    // same idea as the mousemove handler for desktop hover. Mouse is
    // excluded here since onMouseMove already owns panning for that case.
    if (zoomed) {
      if (e.pointerType === 'mouse') return
      const rect = e.currentTarget.getBoundingClientRect()
      setZoomOrigin({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      })
      return
    }
    if (!pressStart.current) return
    const dx = e.clientX - pressStart.current.x
    const dy = e.clientY - pressStart.current.y
    // Moved too far before the hold completed — this is a swipe, not a
    // zoom request, so back off and let the drag gesture handle it.
    if (Math.hypot(dx, dy) > LONG_PRESS_SLOP_PX) clearLongPress()
  }

  function handlePointerUp(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === 'mouse') return
    clearLongPress()
    setZoomed(false)
  }

  // Desktop click-to-zoom — a click toggles the magnifier, mouse movement
  // then pans it under the cursor. Preload the high-res source on hover so
  // it's usually already cached by the time the click actually lands.
  function handleMouseEnter() {
    if (isVideoSlide || displayedSlide.type !== 'image') return
    const preload = new window.Image()
    preload.src = pdpZoomUrl(displayedSlide.src, fitFor(displayed)) || PLACEHOLDER_URL
  }

  function handleMouseClick(e: React.MouseEvent<HTMLDivElement>) {
    if (isVideoSlide) return
    // Guard against the synthetic click a touch tap also fires — touch
    // devices already zoom via long-press and shouldn't double-trigger here.
    if (typeof window !== 'undefined' && !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
    setZoomed((z) => !z)
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    setZoomOrigin({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }

  function handleMouseLeave() {
    setZoomed(false)
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image — drag left/right to slide between images, click (or press and hold on touch) to zoom */}
      <motion.div
        className="relative aspect-3/4 bg-lp-image-bg overflow-hidden touch-pan-y select-none"
        style={{ WebkitTouchCallout: 'none', cursor: isVideoSlide ? 'default' : zoomed ? 'crosshair' : 'zoom-in' }}
        drag={slides.length > 1 && !zoomed ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleMouseClick}
        onContextMenu={(e) => e.preventDefault()}
      >
        {recentPurchases && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-lp-porcelain/90 backdrop-blur-sm px-2.5 py-1">
            <Flame size={12} strokeWidth={1.75} className="text-lp-gold shrink-0" />
            <span className="font-body text-[0.7rem] text-lp-ink">
              <span className="font-semibold">{recentPurchases}</span> bought in the last 7 days
            </span>
          </div>
        )}

        {/* Desktop-only hint — touch devices already discover zoom via long-press */}
        {!zoomed && !isVideoSlide && (
          <div className="absolute top-3 right-3 z-10 hidden pointer-fine:flex items-center gap-1.5 rounded-full bg-lp-porcelain/90 backdrop-blur-sm px-2.5 py-1 pointer-events-none">
            <ZoomIn size={12} strokeWidth={1.75} className="text-lp-ink shrink-0" />
            <span className="font-body text-[0.7rem] text-lp-ink">Click to zoom</span>
          </div>
        )}

        {/* mode="sync" (the default) crossfades the incoming photo over the
            outgoing one instead of waiting for the old one to fully exit
            first — "wait" was adding up to ~700ms of pure animation delay
            (exit duration + enter duration) on every color/thumbnail swap,
            on top of however long the image itself took to load. */}
        <AnimatePresence>
          <motion.div
            key={displayed}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{    opacity: 0, x: -8 }}
            transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
            {displayedSlide.type === 'video' ? (
              <iframe
                src={`https://www.youtube.com/embed/${displayedSlide.youtubeId}?rel=0&modestbranding=1`}
                title={`${productName} video`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full"
              />
            ) : (
              <Image
                // Zoomed uses a distinct, higher-resolution source (and skips
                // the responsive loader via `unoptimized`, which would
                // otherwise downscale it back to a normal-display size) so
                // magnifying reveals real detail instead of stretched pixels.
                src={(zoomed ? pdpZoomUrl(displayedSlide.src, fitFor(displayed)) : pdpUrl(displayedSlide.src, fitFor(displayed))) || PLACEHOLDER_URL}
                unoptimized={zoomed}
                alt={`${productName}, view ${displayed + 1}`}
                fill
                priority={isFirstLoad.current}
                draggable={false}
                className="object-cover object-center"
                style={{
                  transform:       zoomed ? 'scale(2)' : 'scale(1)',
                  transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                  transition:      zoomed ? 'transform 0.2s ease-out' : 'transform 0.25s ease-in',
                }}
                sizes="(max-width:768px) 100vw, 50vw"
              />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Thumbnails — mobile only. On desktop this same strip renders inside
          ProductInfo instead, below the colour swatches, driven by the same
          `active`/`onActiveChange` pair passed in from ProductPageClient. */}
      {slides.length > 1 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-hide md:hidden">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => onActiveChange(i)}
              className={`relative shrink-0 w-16 h-21.25 overflow-hidden bg-lp-image-bg border transition-colors duration-200 ${
                i === active
                  ? 'border-lp-gold shadow-[inset_0_0_0_1px_var(--color-lp-gold)]'
                  : 'border-lp-border hover:border-lp-border-strong'
              }`}
              aria-label={slide.type === 'video' ? `${productName} video` : `View image ${i + 1}`}
              aria-pressed={i === active}
            >
              {slide.type === 'video' ? (
                <>
                  {/* Plain <img>, not next/image — img.youtube.com isn't in
                      next.config.ts's remotePatterns and doesn't need the
                      optimization pipeline for a 64px thumbnail anyway. */}
                  <img
                    src={youtubeThumbnail(slide.youtubeId)}
                    alt={`${productName} video thumbnail`}
                    className="absolute inset-0 w-full h-full object-cover object-center"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <Play size={16} strokeWidth={0} fill="white" className="ml-0.5" />
                  </span>
                </>
              ) : (
                <Image
                  src={thumbUrl(slide.src, fitFor(i)) || PLACEHOLDER_URL}
                  alt={`${productName} thumbnail ${i + 1}`}
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
