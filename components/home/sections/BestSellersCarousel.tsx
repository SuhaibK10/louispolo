'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/BestSellersCarousel.tsx
// Draggable product carousel — featured products from config/products.ts.
// Pattern adapted from B&B Appliances ProductCarousel.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect }       from 'react'
import { createPortal }                      from 'react-dom'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion, AnimatePresence, useMotionValue } from 'framer-motion'
import { ArrowRight, ShoppingBag, Ruler, Heart, Star, ChevronDown, Play, X, Maximize, Eye } from 'lucide-react'
import type { ProductSize }                  from '@/types'
import { FEATURED_PRODUCTS }                 from '@/config/products'
import { cardUrl, pdpUrl, PLACEHOLDER_URL }  from '@/lib/cloudflareImages'
import { cfVideo }                           from '@/lib/cloudflareStream'
import { formatPrice, swatchRingColor, defaultSize } from '@/lib/utils'
import { ROUTES }                            from '@/lib/constants'
import { saveShopScroll }                    from '@/lib/scrollRestore'
import { useCartStore }                      from '@/store/cartStore'
import { useWishlistStore }                  from '@/store/wishlistStore'
import { staggerChildren, fadeUp, VIEWPORT, tapPunch } from '@/lib/animations'
import { SizeGuideModal }                    from '@/components/ui/SizeGuideModal'
import { ReviewsModal }                      from '@/components/ui/ReviewsModal'
import { QuickViewModal }                    from '@/components/shop/QuickViewModal'
import { DemoVideoModal }                    from '@/components/product/DemoVideoModal'
import { getReviewsForProduct, getManualRating } from '@/config/reviews'
import { MyntraBuyButton }                   from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize, MYNTRA_EXCLUSIVES_ENABLED } from '@/config/myntra'

// ─── Single product card — mirrors components/shop/ProductCard.tsx exactly,
// except for the width/drag-track classes a carousel item needs. ────────────
function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
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

  const [activeVariant,   setActiveVariant]   = useState(0)
  const [hoveredVariant,  setHoveredVariant]  = useState<number | null>(null)
  const [activeSize,      setActiveSize]      = useState<ProductSize | null>(
    defaultSize(product.variants[0].sizes)
  )
  const [addedToCart,     setAddedToCart]     = useState(false)
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false)
  const [quickViewOpen,   setQuickViewOpen]   = useState(false)
  const [detailsOpen,     setDetailsOpen]     = useState(false)
  const [reviewsOpen,     setReviewsOpen]     = useState(false)

  const reviews      = getReviewsForProduct(product.slug)
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

  // Warm every color swatch's card-sized image as soon as the card mounts —
  // same fix as components/shop/ProductCard.tsx, needed here too since this
  // is a separate duplicated implementation, not a shared import.
  useEffect(() => {
    product.variants.forEach((v, i) => {
      const img = v.images?.[0] ?? product.images[i] ?? product.images[0]
      const preload = new window.Image()
      preload.src = cardUrl(img, product.imageFit) || PLACEHOLDER_URL
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  // Same cold-fetch-avoidance trick as the shop grid card — warm the PDP's
  // own image crop on hover/touch so the click-through feels instant.
  function prefetchPdpImage() {
    const preload = new window.Image()
    preload.src = pdpUrl(displayImage, product.imageFit) || PLACEHOLDER_URL
  }

  function prefetchDemoVideo() {
    if (!product.demoVideoId) return
    const preload = document.createElement('video')
    preload.preload = 'auto'
    preload.muted = true
    preload.src = cfVideo(product.demoVideoId)
  }

  return (
    <div className="group flex-shrink-0 flex flex-col w-[68vw] sm:w-[40vw] md:w-[30vw] lg:w-[22rem] lp-card">
      {/* Image container */}
      <Link
        href={`${ROUTES.shop}/${product.slug}?color=${encodeURIComponent(variant.color)}`}
        onClick={saveShopScroll}
        onMouseEnter={prefetchPdpImage}
        onTouchStart={prefetchPdpImage}
        draggable="false"
        className="relative block aspect-[4/4.8] md:aspect-[3/4] overflow-hidden bg-lp-image-bg"
      >
        <div
          className="absolute inset-0"
          style={!videoOpen && product.cardZoom ? { transform: `scale(${product.cardZoom})` } : undefined}
        >
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
              draggable="false"
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              sizes="(max-width:768px) 72vw, (max-width:1024px) 40vw, 22rem"
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
          <span className="absolute top-3 left-3 z-10 flex items-center justify-center rounded-full p-1.5 bg-white border border-[#5B6670]/25 shadow-sm">
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
            <span className="w-full h-full rounded-full flex items-center justify-center bg-lp-porcelain/90 backdrop-blur-sm border border-[var(--color-lp-border)]">
              {videoOpen
                ? <X size={13} strokeWidth={1.5} className="text-[var(--color-lp-ink)]" />
                : <Play size={13} strokeWidth={1.5} className="text-[var(--color-lp-ink)] ml-0.5" />}
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
          <span className="relative block">
            <motion.span
              className="block"
              animate={burst ? { scale: [1, 1.28, 1, 1.32, 1] } : { scale: 1 }}
              transition={{ duration: 1, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <Heart
                size={19}
                strokeWidth={1.5}
                className="transition-colors duration-200"
                style={{ color: wished ? '#C0392B' : 'var(--color-lp-muted)', fill: wished ? '#C0392B' : 'none' }}
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

        {/* Quick View — opens a mini-PDP without leaving the carousel */}
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

      {/* Info */}
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
            Reviews — parallel row, mirrors components/shop/ProductCard.tsx */}
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
            <span className="hidden sm:inline ml-2 font-normal text-[0.875rem] text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)]">
              {activeSize ? formatPrice(price) : formatPrice(lowestPrice)}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-[0.78rem] bg-lp-success/10 text-lp-success">
              ({Math.round((1 - myntraTarget.price / (activeSize ? price : lowestPrice)) * 100)}% off)
            </span>
          </p>
        ) : product.mrp ? (
          <p className="font-body text-[1rem] md:text-[1.125rem] font-medium leading-[1.2] tracking-[-0.015em] text-[#1C1B19] whitespace-nowrap">
            {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
            <span className="hidden sm:inline ml-2 font-normal text-[0.875rem] text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)]">
              {formatPrice(product.mrp)}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-[0.78rem] bg-lp-success/10 text-lp-success">
              ({Math.round((1 - (activeSize ? price : lowestPrice) / product.mrp) * 100)}% off)
            </span>
          </p>
        ) : (
        <p className="font-body text-[1rem] md:text-[1.125rem] font-medium leading-[1.2] tracking-[-0.015em] text-[#1C1B19]">
          {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
        </p>
        )}

        {/* Buy on Myntra (stocked there) or Add to cart */}
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

      {sizeGuideOpen && createPortal(
        <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />,
        document.body
      )}
      {youtubeOpen && (variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId) && createPortal(
        <DemoVideoModal
          open={youtubeOpen}
          onClose={() => setYoutubeOpen(false)}
          youtubeId={variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId}
        />,
        document.body
      )}
      {quickViewOpen && createPortal(
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
        />,
        document.body
      )}
      {reviewsOpen && createPortal(
        <ReviewsModal
          open={reviewsOpen}
          onClose={() => setReviewsOpen(false)}
          productName={product.name}
          reviews={reviews}
        />,
        document.body
      )}
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

const MYNTRA_FEATURED    = FEATURED_PRODUCTS.filter((p) => getMyntraListing(p.slug))
const NON_MYNTRA_FEATURED = FEATURED_PRODUCTS.filter((p) => !getMyntraListing(p.slug))

type Tab = 'bestsellers' | 'myntra'

export function BestSellersCarousel() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)
  const [tab, setTab] = useState<Tab>('bestsellers')
  const x = useMotionValue(0)

  const products = tab === 'myntra' ? MYNTRA_FEATURED : NON_MYNTRA_FEATURED

  useEffect(() => {
    const calculate = () => {
      if (trackRef.current && containerRef.current) {
        setDragWidth(trackRef.current.scrollWidth - containerRef.current.offsetWidth)
      }
    }
    if (!trackRef.current) return
    const ro = new ResizeObserver(calculate)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [tab])

  useEffect(() => { x.set(0) }, [tab, x])

  // Trackpad two-finger horizontal swipe fires wheel events with deltaX —
  // Framer's drag="x" only listens for pointer drag, so we translate wheel
  // panning into the same motion value by hand. Native listener (not React's
  // onWheel) so preventDefault actually stops the page from scrolling.
  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    function onWheel(e: WheelEvent) {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return
      e.preventDefault()
      const next = x.get() - e.deltaX
      x.set(Math.min(0, Math.max(-dragWidth, next)))
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [dragWidth, x])

  return (
    <section className="pt-10 md:pt-14 pb-20 md:pb-28 xl:pb-36 overflow-hidden">

      {/* Tabs */}
      {MYNTRA_EXCLUSIVES_ENABLED && (
        <div className="container-lp flex items-center justify-center gap-5" style={{ marginBottom: '1.5rem' }}>
          <button
            type="button"
            onClick={() => setTab('bestsellers')}
            className={
              tab === 'bestsellers'
                ? 'font-body font-bold text-[0.8rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
                : 'font-body font-semibold text-[0.8rem] tracking-widest uppercase text-lp-ink/70 border-b-2 border-transparent pb-1.5 transition-colors duration-200'
            }
          >
            Best Sellers
          </button>
          <span className="text-lp-border">|</span>
          <button
            type="button"
            onClick={() => setTab('myntra')}
            className={
              tab === 'myntra'
                ? 'flex items-center gap-1.5 font-body font-bold text-[0.8rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
                : 'flex items-center gap-1.5 font-body font-semibold text-[0.8rem] tracking-widest uppercase text-lp-ink/70 border-b-2 border-transparent pb-1.5 transition-colors duration-200'
            }
          >
            <Image src="/myntra-m.png" alt="" width={13} height={11} unoptimized />
            Myntra Exclusives
          </button>
        </div>
      )}

      <div className="container-lp flex items-end justify-between" style={{ marginBottom: '2.5rem' }}>

        <motion.div
          key={tab}
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            {tab === 'myntra' ? 'Available exclusively on' : "India's most-carried"}
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            {tab === 'myntra' ? 'Myntra Exclusives' : 'Best Sellers'}
          </motion.h2>
        </motion.div>

        <div className="hidden md:flex items-center gap-6">
          <Link
            href="/compare"
            className="font-body text-[0.75rem] tracking-widest uppercase text-lp-muted hover:text-lp-gold transition-colors duration-200"
          >
            Compare
          </Link>
          <Link
            href={ROUTES.shop}
            className="flex items-center gap-2 font-body text-[0.75rem] tracking-widest uppercase text-lp-muted hover:text-lp-gold transition-colors duration-200 group"
          >
            See the full lineup
            <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>

      {/* Drag-to-scroll track */}
      <div ref={containerRef} className="overflow-hidden w-full">
        <motion.div
          key={tab}
          ref={trackRef}
          drag="x"
          style={{ x, WebkitUserSelect: 'none' }}
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragMomentum={true}
          dragTransition={{ power: 0.9, timeConstant: 400 }}
          className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
          whileTap={{ cursor: 'grabbing' }}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>

      <div className="md:hidden" style={{ marginTop: '3rem' }}>
        <div className="container-lp flex flex-col gap-3">
          <Link href={ROUTES.shop} className="btn-outline w-full justify-center rounded-md">
            View all products
          </Link>
          <Link href="/compare" className="btn-outline w-full justify-center rounded-md">
            Compare products
          </Link>
        </div>
      </div>
    </section>
  )
}
