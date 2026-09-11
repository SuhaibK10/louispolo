'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductCard.tsx
// Shop grid card. Color swatch selection previews the product image variant.
// Clicking navigates to PDP. Color/size is passed as query param.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import Image                        from 'next/image'
import Link                         from 'next/link'
import { motion, AnimatePresence }  from 'framer-motion'
import { ArrowRight, ShoppingBag, Check, Heart, Ruler, Star, ChevronDown, Play, X, Maximize, Eye } from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { cardUrl, pdpUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import { cfVideo }                  from '@/lib/cloudflareStream'
import { formatPrice, swatchRingColor, defaultSize } from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'
import { saveShopScroll }           from '@/lib/scrollRestore'
import { useCartStore }             from '@/store/cartStore'
import { useWishlistStore }         from '@/store/wishlistStore'
import { SizeGuideModal }           from '@/components/ui/SizeGuideModal'
import { ReviewsModal }             from '@/components/ui/ReviewsModal'
import { QuickViewModal }           from '@/components/shop/QuickViewModal'
import { DemoVideoModal }           from '@/components/product/DemoVideoModal'
import { MyntraBuyButton }          from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize } from '@/config/myntra'
import { getReviewsForProduct, getManualRating } from '@/config/reviews'
import { tapPunch }                 from '@/lib/animations'

interface ProductCardProps {
  product: Product
  // Opens the card on this literal variant.color instead of variants[0] —
  // used by sections that already filtered products down to a specific
  // color (e.g. the homepage "Take What You Need" color carousel), so the
  // card shows the color the shopper actually picked rather than whatever
  // happens to be first.
  initialColor?: string
}

export function ProductCard({ product, initialColor }: ProductCardProps) {
  const initialVariantIndex = (() => {
    if (!initialColor) return 0
    const i = product.variants.findIndex((v) => v.color === initialColor)
    return i === -1 ? 0 : i
  })()
  const addItem  = useCartStore((s) => s.addItem)
  const toggle   = useWishlistStore((s) => s.toggle)
  const has      = useWishlistStore((s) => s.has)
  const [wished, setWished] = useState(false)
  const [burst,  setBurst]  = useState(false)
  const [videoOpen, setVideoOpen] = useState(false)
  const [youtubeOpen, setYoutubeOpen] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handleFullscreen(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const video = videoRef.current
    if (!video) return
    if (video.requestFullscreen) {
      video.requestFullscreen()
    } else if ('webkitEnterFullscreen' in video) {
      // iOS Safari doesn't support the standard Fullscreen API on <video>
      ;(video as HTMLVideoElement & { webkitEnterFullscreen: () => void }).webkitEnterFullscreen()
    }
  }

  // Sync after hydration to avoid SSR mismatch
  useEffect(() => { setWished(has(product.id)) }, [has, product.id])

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    const adding = !wished
    toggle(product.id)
    setWished(adding)
    if (adding) {
      setBurst(true)
      setTimeout(() => setBurst(false), 1050)
    }
  }

  const [activeVariant,   setActiveVariant]   = useState(initialVariantIndex)
  const [hoveredVariant,  setHoveredVariant]  = useState<number | null>(null)
  const [activeSize,      setActiveSize]      = useState<ProductSize | null>(
    defaultSize(product.variants[initialVariantIndex].sizes)
  )
  const [addedToCart,     setAddedToCart]     = useState(false)
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false)
  const [detailsOpen,     setDetailsOpen]     = useState(false)
  const [reviewsOpen,     setReviewsOpen]     = useState(false)
  const [quickViewOpen,   setQuickViewOpen]   = useState(false)

  const reviews = getReviewsForProduct(product.slug)
  const manualRating = getManualRating(product.slug)

  const variant      = product.variants[activeVariant]
  const lowestPrice  = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const displayImage = variant.images?.[0] ?? product.images[activeVariant] ?? product.images[0]

  // Hovering a swatch previews that color's photo without actually
  // selecting it — cart/link/price all stay tied to activeVariant, only the
  // image shown swaps back and forth.
  const hoveredImageVariant = hoveredVariant !== null ? product.variants[hoveredVariant] : null
  const previewImage = hoveredImageVariant
    ? (hoveredImageVariant.images?.[0] ?? product.images[hoveredVariant!] ?? product.images[0])
    : displayImage
  const sizeObj       = variant.sizes.find(s => s.size === activeSize)
  const price         = sizeObj?.price ?? lowestPrice
  const inStock       = sizeObj ? sizeObj.stock > 0 : true
  const canAdd        = activeSize !== null && inStock

  // Stocked on Myntra → CTA routes there instead of the cart
  const myntra        = getMyntraListing(product.slug)
  const myntraTarget  = getMyntraForSize(product.slug, activeSize)

  function handleColorChange(e: React.MouseEvent, i: number) {
    e.stopPropagation()
    setActiveVariant(i)
    setActiveSize(defaultSize(product.variants[i].sizes))
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    if (!canAdd || !sizeObj || !activeSize) return

    addItem({
      variantKey:  `${product.id}-${variant.color}-${activeSize}`,
      productId:   product.id,
      productName: product.name,
      productSlug: product.slug,
      image:       displayImage,
      color:       variant.color,
      colorHex:    variant.colorHex,
      size:        activeSize,
      price:       sizeObj.price,
      quantity:    1,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 7000)
  }

  // Warm every color swatch's images as soon as the card mounts — without
  // this, switching colors (hover or click) pays a cold network fetch each
  // time, which is what made swatch switching feel slow. Both sizes: the
  // card-sized crop shown here, and the PDP-sized crop Quick View uses
  // (same product/variants, opened straight from this card). Small assets,
  // few variants, so preloading all of them up front is cheap and means
  // every swap — on the card or inside Quick View — is already cached.
  useEffect(() => {
    product.variants.forEach((v, i) => {
      const img = v.images?.[0] ?? product.images[i] ?? product.images[0]
      new window.Image().src = cardUrl(img, product.imageFit) || PLACEHOLDER_URL
      new window.Image().src = pdpUrl(img, product.imageFit) || PLACEHOLDER_URL
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // The shop grid only ever loads the card-sized crop — a different derived
  // asset from the PDP's main image. Without this, clicking through to the
  // PDP always triggers a cold fetch for that specific size, even though
  // the same photo was just visible seconds ago. Warming it on hover/touch
  // means it's usually already cached by the time the page actually opens.
  function prefetchPdpImage() {
    const preload = new window.Image()
    preload.src = pdpUrl(displayImage, product.imageFit) || PLACEHOLDER_URL
  }

  // Same idea for the demo video — without this, hitting Play always pays
  // a cold-start fetch (connection is already warm via the layout-level
  // preconnect, but the video bytes themselves haven't loaded yet). Warming
  // it on hover/touch means playback is usually instant by the time the
  // button is actually tapped. Not appended to the DOM — same trick as
  // prefetchPdpImage above, setting `src` alone triggers the browser's
  // fetch regardless of DOM attachment.
  function prefetchDemoVideo() {
    if (!product.demoVideoId) return
    const preload = document.createElement('video')
    preload.preload = 'auto'
    preload.muted = true
    preload.src = cfVideo(product.demoVideoId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col lp-card"
    >
      {/* Image container */}
      <Link
        href={`${ROUTES.shop}/${product.slug}?color=${encodeURIComponent(variant.color)}`}
        onClick={saveShopScroll}
        onMouseEnter={prefetchPdpImage}
        onTouchStart={prefetchPdpImage}
        className="relative block aspect-[4/4.8] md:aspect-[3/4] overflow-hidden bg-lp-image-bg"
      >
        <div
          className="absolute inset-0"
          style={!videoOpen && product.cardZoom ? { transform: `scale(${product.cardZoom})` } : undefined}
        >
          {/* Demo video swaps into this same frame instead of opening a
              modal — the play button toggles it, and tapping it again (or
              the rest of the card) works exactly like the image did. */}
          {videoOpen && product.demoVideoId ? (
            <video
              ref={videoRef}
              key={product.demoVideoId}
              src={cfVideo(product.demoVideoId)}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
          ) : (
            <Image
              src={cardUrl(previewImage, product.imageFit) || PLACEHOLDER_URL}
              alt={`${product.name} in ${(hoveredImageVariant ?? variant).color}`}
              fill
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
            />
          )}
        </div>

        {/* Fullscreen — only while the demo video is actually playing */}
        {videoOpen && product.demoVideoId && (
          <motion.button
            type="button"
            onClick={handleFullscreen}
            whileTap={tapPunch}
            className="absolute bottom-3 right-3 z-10 w-7 h-7 flex items-center justify-center"
            aria-label="View video fullscreen"
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-lp-porcelain/90 backdrop-blur-sm border border-[var(--color-lp-border)]">
              <Maximize size={12} strokeWidth={1.5} className="text-[var(--color-lp-ink)]" />
            </span>
          </motion.button>
        )}

        {/* Myntra Exclusive badge */}
        {myntra && (
          <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 flex items-center justify-center rounded-full p-1.5 bg-white border border-[#5B6670]/25 shadow-sm">
            <Image src="/myntra-m.png" alt="Myntra" width={13} height={11} unoptimized />
          </span>
        )}

        {/* Tag */}
        {product.tag && (
          <span className={`lp-tag absolute left-3 z-10 ${myntra ? 'top-10' : 'top-3'}`}>{product.tag}</span>
        )}

        {/* Play — product demo video, only shown when the product has one.
            A Cloudflare-hosted video swaps inline into the card frame; a
            YouTube trial video (no demoVideoId) opens the fullscreen modal
            instead, since an iframe can't do the same inline loop/crop. */}
        {(product.demoVideoId || variant.demoVideoYoutubeId || product.demoVideoYoutubeId) && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (product.demoVideoId) {
                setVideoOpen((v) => !v)
              } else {
                setYoutubeOpen(true)
              }
            }}
            onMouseEnter={prefetchDemoVideo}
            onTouchStart={prefetchDemoVideo}
            whileTap={tapPunch}
            className="absolute top-3 left-3 z-10 w-7 h-7 flex items-center justify-center"
            aria-label={videoOpen ? 'Stop product demo video' : 'Play product demo video'}
          >
            {!videoOpen && (
              <motion.span
                className="absolute inset-0 rounded-full border border-white/40"
                animate={{ scale: [1, 1.35], opacity: [0.6, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span
              className="relative w-full h-full rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.35)] transition-transform duration-200 hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #2A2926 0%, #1C1B19 100%)' }}
            >
              {videoOpen
                ? <X size={14} strokeWidth={1.75} className="text-lp-porcelain" />
                : <Play size={14} strokeWidth={0} fill="currentColor" className="text-lp-porcelain ml-0.5" />}
            </span>
          </motion.button>
        )}

        {/* Wishlist heart */}
        <motion.button
          type="button"
          onClick={handleWishlist}
          whileTap={tapPunch}
          className="absolute top-3 right-3 z-10 w-7 h-7 flex items-center justify-center"
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <span className="relative w-full h-full block">
            <motion.span
              className="w-full h-full rounded-full flex items-center justify-center bg-lp-porcelain/90 backdrop-blur-sm border border-[var(--color-lp-border)]"
              animate={burst ? { scale: [1, 1.28, 1, 1.32, 1] } : { scale: 1 }}
              transition={{ duration: 1, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <Heart
                size={15}
                strokeWidth={1.5}
                className="transition-colors duration-200"
                style={{ color: wished ? '#C0392B' : 'var(--color-lp-ink)', fill: wished ? '#C0392B' : 'none' }}
              />
            </motion.span>
            {burst && (
              <motion.span
                className="absolute -inset-1 rounded-full pointer-events-none"
                style={{ border: '1.5px solid #C0392B' }}
                initial={{ scale: 0.4, opacity: 0.9 }}
                animate={{ scale: 1.9, opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            )}
          </span>
        </motion.button>

        {/* Quick View — opens a mini-PDP without leaving the grid. Right
            side, stacked below the wishlist heart, so it never collides
            with the tag/Myntra badge or the Play button on the left. */}
        {!videoOpen && (
          <motion.button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              setQuickViewOpen(true)
            }}
            whileTap={tapPunch}
            className="absolute bottom-3 left-3 z-10 w-7 h-7 flex items-center justify-center"
            aria-label="Quick view"
          >
            <span className="w-full h-full rounded-full flex items-center justify-center bg-lp-porcelain/90 backdrop-blur-sm border border-[var(--color-lp-border)]">
              <Eye size={15} strokeWidth={1.5} className="text-[var(--color-lp-ink)]" />
            </span>
          </motion.button>
        )}

        {/* Quick shop overlay */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-[var(--color-lp-ink)]/70 backdrop-blur-sm rounded-full px-3.5 py-1.5 flex items-center gap-1.5">
          <span className="font-body text-[0.62rem] tracking-[0.1em] uppercase text-[var(--color-lp-porcelain)]">
            View Product
          </span>
          <ArrowRight size={10} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
        </div>
      </Link>

      {/* Info — flex column filling the card so the CTA row can pin to the
          bottom and stay aligned across cards whose content wraps differently */}
      <div className="flex-1 flex flex-col space-y-1.5 p-3">
        {/* Category + name */}
        <p className="font-body font-medium text-[0.625rem] tracking-[0.08em] uppercase text-[var(--color-lp-faint)]">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        {/* Name left · Myntra rating right, on the same line */}
        <div className="flex items-center justify-between gap-2">
          <Link href={`${ROUTES.shop}/${product.slug}`} onClick={saveShopScroll} onMouseEnter={prefetchPdpImage}>
            <p className="lp-heading-product hover:text-[var(--color-lp-gold)] transition-colors duration-200">
              {product.name}
            </p>
          </Link>
          {myntra?.rating ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-body font-bold text-[0.75rem] text-lp-ink bg-lp-gold/15 border border-lp-gold/40 leading-none shrink-0">
              <Star size={11} strokeWidth={0} className="fill-lp-gold" />
              {myntra.rating.toFixed(1)}
              <span className="font-medium opacity-70">({myntra.ratingCount})</span>
            </span>
          ) : manualRating ? (
            <span className="inline-flex items-center gap-1 rounded-full px-2 py-1 font-body font-bold text-[0.75rem] text-lp-ink bg-lp-gold/15 border border-lp-gold/40 leading-none shrink-0">
              <Star size={11} strokeWidth={0} className="fill-lp-gold" />
              {manualRating.rating.toFixed(1)}
              <span className="font-medium opacity-70">({manualRating.count})</span>
            </span>
          ) : null}
        </div>

        {/* Size chips */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex flex-wrap gap-1">
          {!product.hideSizeSelector && variant.sizes.map(({ size, stock }) => {
            const outOfStock = stock === 0
            const isSelected = activeSize === size
            return (
              <button
                key={size}
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  if (!outOfStock) setActiveSize(size)
                }}
                disabled={outOfStock}
                className={
                  outOfStock
                    ? 'relative font-body text-[0.6rem] md:text-[0.65rem] px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                    : isSelected
                    ? 'font-body text-[0.6rem] md:text-[0.65rem] px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                    : 'font-body text-[0.6rem] md:text-[0.65rem] px-2 py-0.5 md:px-2.5 md:py-1 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-muted)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
                }
                aria-pressed={isSelected}
                aria-label={outOfStock ? `${size}, out of stock` : size}
              >
                {size}
              </button>
            )
          })}
          </div>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-1 font-body font-semibold text-[0.75rem] leading-none shrink-0"
            style={{
              backgroundColor: `${variant.colorHex}20`,
              color: swatchRingColor(variant.colorHex),
              border: `1px solid ${variant.colorHex}55`,
            }}
          >
            {variant.color}
            {variant.accentColor && (
              <span className="opacity-70"> | {variant.accentColor}</span>
            )}
          </span>
        </div>

        {/* Color swatches + Size Guide */}
        {(() => {
          const hasStandardSizes = !product.hideSizeGuide && product.variants.some(v => v.sizes.some(s => s.size !== 'One Size'))
          return (
            <div className="flex items-center justify-between pt-0.5">
              <div className="flex items-center gap-1.5">
                {product.variants.map((v, i) => (
                  <button
                    key={v.color}
                    type="button"
                    onClick={(e) => handleColorChange(e, i)}
                    onMouseEnter={() => setHoveredVariant(i)}
                    onMouseLeave={() => setHoveredVariant(null)}
                    title={v.color}
                    className="w-3.5 h-3.5 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: v.bodyHex
                        ? `linear-gradient(135deg, ${v.bodyHex} 60%, ${v.colorHex} 60%)`
                        : v.colorHex,
                      boxShadow: i === activeVariant
                        ? `0 0 0 1.5px var(--color-lp-porcelain), 0 0 0 3px ${swatchRingColor(v.colorHex)}`
                        : '0 0 0 1px var(--color-lp-border-strong)',
                    }}
                    aria-label={v.color}
                    aria-pressed={i === activeVariant}
                  />
                ))}
              </div>
              {hasStandardSizes && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setSizeGuideOpen(true) }}
                  className="flex items-center gap-1 font-body font-medium text-[0.75rem] text-[var(--color-lp-faint)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                >
                  <Ruler size={10} strokeWidth={1.5} />
                  Size Guide
                </button>
              )}
            </div>
          )
        })()}

        {/* View details (reveals the short product description inline) +
            Reviews — parallel row, sits below the color-swatch/Size-Guide row */}
        <div className="pt-0.5">
          <div className="flex items-center justify-between gap-2">
            {product.description ? (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setDetailsOpen((o) => !o) }}
                className="flex items-center gap-1 font-body font-medium text-[0.75rem] text-[var(--color-lp-faint)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-expanded={detailsOpen}
              >
                View Details
                <ChevronDown
                  size={11}
                  strokeWidth={1.5}
                  className={`transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}
                />
              </button>
            ) : <span />}
            {!myntra && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setReviewsOpen(true) }}
                className="flex items-center gap-1 font-body font-medium text-[0.75rem] text-[var(--color-lp-faint)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
              >
                {reviews.length > 0 ? `Reviews (${reviews.length})` : 'Reviews'}
              </button>
            )}
          </div>
          {product.description && (
            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-body text-[0.78rem] leading-relaxed text-[var(--color-lp-body)] pt-1.5">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Price — single line in both branches so Myntra and
            non-Myntra cards keep identical height and buttons align */}
        {myntra && myntraTarget ? (
          <p className="font-body text-[1rem] md:text-[1.125rem] font-medium leading-[1.2] tracking-[-0.015em] text-[#1C1B19] whitespace-nowrap">
            {activeSize ? formatPrice(myntraTarget.price) : `From ${formatPrice(myntraTarget.price)}`}
            <span className="ml-1.5 sm:ml-2 font-normal text-[0.72rem] sm:text-[0.875rem] text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)]">
              {activeSize ? formatPrice(price) : formatPrice(lowestPrice)}
            </span>
            <span className="ml-1.5 sm:ml-2 inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 font-semibold text-[0.65rem] sm:text-[0.78rem] bg-lp-success/10 text-lp-success">
              ({Math.round((1 - myntraTarget.price / (activeSize ? price : lowestPrice)) * 100)}% off)
            </span>
          </p>
        ) : product.mrp ? (
          <p className="font-body text-[1rem] md:text-[1.125rem] font-medium leading-[1.2] tracking-[-0.015em] text-[#1C1B19] whitespace-nowrap">
            {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
            <span className="ml-1.5 sm:ml-2 font-normal text-[0.72rem] sm:text-[0.875rem] text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)]">
              {formatPrice(product.mrp)}
            </span>
            <span className="ml-1.5 sm:ml-2 inline-flex items-center rounded-full px-1.5 sm:px-2 py-0.5 font-semibold text-[0.65rem] sm:text-[0.78rem] bg-lp-success/10 text-lp-success">
              ({Math.round((1 - (activeSize ? price : lowestPrice) / product.mrp) * 100)}% off)
            </span>
          </p>
        ) : (
        <p className="font-body text-[1rem] md:text-[1.125rem] font-medium leading-[1.2] tracking-[-0.015em] text-[#1C1B19]">
          {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
        </p>
        )}

        {/* Buy on Myntra (stocked there) or Add to cart — mt-auto pins this
            block to the card bottom (safety net for two-line product names);
            content rows above are height-matched so the slack stays small */}
        <div className="mt-auto pt-2">
          {myntra && myntraTarget ? (
            <MyntraBuyButton
              url={myntraTarget.url}
              slug={product.slug}
              size={activeSize}
              placement="card"
              className="btn-ghost w-full justify-center"
            />
          ) : addedToCart ? (
            <Link
              href="/checkout"
              className="btn-gold w-full justify-center"
              style={{ height: '36px' }}
            >
              Checkout
            </Link>
          ) : (
          <motion.button
            type="button"
            onClick={handleAddToCart}
            disabled={!canAdd}
            className={
              canAdd
                ? 'btn-ghost w-full justify-center'
                : 'btn-ghost w-full justify-center opacity-40 cursor-not-allowed'
            }
            style={{ height: '36px' }}
            whileTap={canAdd ? tapPunch : {}}
          >
            {activeSize && <ShoppingBag size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
            {!activeSize ? 'Select Color & Size' : 'Add to cart'}
          </motion.button>
          )}
        </div>
      </div>

      {(variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId) && (
        <DemoVideoModal
          open={youtubeOpen}
          onClose={() => setYoutubeOpen(false)}
          youtubeId={variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId}
        />
      )}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <ReviewsModal open={reviewsOpen} onClose={() => setReviewsOpen(false)} productName={product.name} reviews={reviews} />
      <QuickViewModal
        open={quickViewOpen}
        onClose={() => setQuickViewOpen(false)}
        product={product}
        activeVariant={activeVariant}
        activeSize={activeSize}
        onColorChange={(i) => { setActiveVariant(i); setActiveSize(defaultSize(product.variants[i].sizes)) }}
        onSizeChange={setActiveSize}
        displayImage={displayImage}
        price={price}
        canAdd={canAdd}
        addedToCart={addedToCart}
        onAddToCart={handleAddToCart}
        manualRating={manualRating}
        reviews={reviews}
      />
    </motion.div>
  )
}
