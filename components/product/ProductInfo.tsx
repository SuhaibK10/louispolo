'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductInfo.tsx
// Product detail info panel — color selector → size selector → add to cart.
// Size defaults to Cabin (or the variant's first listed size) so a concrete
// price shows immediately instead of a "From ₹X" range — same behavior as
// the shop grid and Best Sellers cards (see lib/utils.ts `defaultSize`).
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect }   from 'react'
import { useRouter }             from 'next/navigation'
import { motion }                from 'framer-motion'
import Link                      from 'next/link'
import Image                     from 'next/image'
import { ShoppingBag, Heart, Ruler, Minus, Plus, ArrowRight, Star, Play } from 'lucide-react'
import { featureIconFor }        from '@/lib/featureIcons'
import type { Product, ProductSize } from '@/types'
import { formatPrice, swatchRingColor, defaultSize } from '@/lib/utils'
import { ROUTES, SEO }           from '@/lib/constants'
import { ShareButton }           from '@/components/ui/ShareButton'
import { useCartStore }          from '@/store/cartStore'
import { thumbUrl, pdpUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import { cfVideo, cfVideoPoster } from '@/lib/cloudflareStream'
import { buildGallerySlides, youtubeThumbnail } from '@/lib/gallerySlides'
import { useWishlistStore }      from '@/store/wishlistStore'
import { SizeGuideModal }        from '@/components/ui/SizeGuideModal'
import { ReviewsModal }          from '@/components/ui/ReviewsModal'
import { DemoVideoModal }        from '@/components/product/DemoVideoModal'
import { ProductAccordions }     from '@/components/product/ProductDetails'
import { MyntraBuyButton }       from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize } from '@/config/myntra'
import { getReviewsForProduct, getManualRating } from '@/config/reviews'
import { tapPunch }              from '@/lib/animations'

interface Props {
  product: Product
  defaultColor?: string
  onColorChange?: (index: number) => void
  onColorHover?: (index: number | null) => void
  // Drives the same main-gallery photo state as ImageGallery's own (mobile)
  // thumbnail strip — see ProductPageClient, which owns this state since
  // both components need to read/write it.
  galleryActiveAngle: number
  onGalleryAngleChange: (index: number) => void
}

export function ProductInfo({ product, defaultColor, onColorChange, onColorHover, galleryActiveAngle, onGalleryAngleChange }: Props) {
  const router        = useRouter()
  const addItem       = useCartStore((s) => s.addItem)

  const defaultVariantIndex = defaultColor
    ? product.variants.findIndex(v => v.color.toLowerCase() === defaultColor.toLowerCase())
    : 0

  const toggle   = useWishlistStore((s) => s.toggle)
  const has      = useWishlistStore((s) => s.has)
  const [wished,        setWished]        = useState(false)
  const [burst,         setBurst]         = useState(false)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const [videoOpen,     setVideoOpen]     = useState(false)
  const [reviewsOpen,   setReviewsOpen]   = useState(false)

  const reviews      = getReviewsForProduct(product.slug)
  const manualRating = getManualRating(product.slug)

  useEffect(() => { setWished(has(product.id)) }, [has, product.id])

  const [colorIndex,    setColorIndex]    = useState(Math.max(0, defaultVariantIndex))
  const [selectedSize,  setSelectedSize]  = useState<ProductSize | null>(
    defaultSize(product.variants[Math.max(0, defaultVariantIndex)].sizes)
  )
  const [addedToCart,   setAddedToCart]   = useState(false)
  const [quantity,      setQuantity]      = useState(1)

  const variant  = product.variants[colorIndex]
  const sizeObj  = variant.sizes.find(s => s.size === selectedSize)
  const price    = sizeObj?.price ?? Math.min(...variant.sizes.map(s => s.price))
  const inStock  = sizeObj ? sizeObj.stock > 0 : true
  const canAdd   = selectedSize !== null && inStock

  // Stocked on Myntra → purchase happens there while our logistics are pending
  const myntra       = getMyntraListing(product.slug)
  const myntraTarget = getMyntraForSize(product.slug, selectedSize)
  const myntraSizeRating = selectedSize && myntra?.sizes?.[selectedSize]?.rating
    ? myntra.sizes[selectedSize]
    : myntra

  // Warms the video's bytes on hover/touch so Play feels instant instead of
  // paying a cold-start fetch when tapped — same trick as image prefetching
  // elsewhere on the site. Not appended to the DOM; setting `src` alone
  // triggers the browser's fetch regardless of DOM attachment.
  function prefetchDemoVideo() {
    if (!product.demoVideoId || product.demoVideoYoutubeId) return
    const preload = document.createElement('video')
    preload.preload = 'auto'
    preload.muted = true
    preload.src = cfVideo(product.demoVideoId)
  }

  // ImageGallery already preloads every photo within the CURRENT color as
  // soon as it's selected — this covers every OTHER color too, so the very
  // first click on a swatch is already warm instead of paying a cold fetch
  // before ImageGallery's own preload effect even kicks in.
  useEffect(() => {
    product.variants.forEach((v, i) => {
      const img = v.images?.[0] ?? product.images[i] ?? product.images[0]
      const preload = new window.Image()
      preload.src = pdpUrl(img, product.imageFit) || PLACEHOLDER_URL
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id])

  function handleColorChange(i: number) {
    setColorIndex(i)
    setSelectedSize(defaultSize(product.variants[i].sizes))
    setQuantity(1)
    onColorChange?.(i)
  }

  function handleAddToCart() {
    if (!canAdd || !sizeObj) return

    addItem({
      variantKey:  `${product.id}-${variant.color}-${selectedSize}`,
      productId:   product.id,
      productName: product.name,
      productSlug: product.slug,
      image:       variant.images?.[0] ?? product.images[colorIndex] ?? product.images[0],
      color:       variant.color,
      colorHex:    variant.colorHex,
      size:        selectedSize,
      price:       sizeObj.price,
      quantity,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 7000)
  }

  return (
    <div className="space-y-6">
      {/* ── Tag + name ─────────────────────────────────────────────────── */}
      {product.tag && (
        <span className="lp-tag">{product.tag}</span>
      )}

      {/* mb-0! / md:mb-1.5! overrides the parent's space-y-6 gap (applied as
          margin-block-end on non-last children in Tailwind v4), which was
          designed for the other sections, not this specific pairing */}
      <div className="mb-2! md:mb-1.5!">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-body font-semibold text-[0.65rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)] mb-1">
              {product.category === 'trolley' ? 'Trolley Bag' : product.category}
            </p>
            <h1 className="lp-heading-pdp-title max-md:text-[2rem]">{product.name}</h1>
          </div>
          <ShareButton
            title={product.name}
            url={`${SEO.url}/shop/${product.slug}`}
            className="mt-1 text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200 shrink-0"
          />
        </div>
      </div>

      {/* ── Recent purchases — quiet social proof, not a bargain-urgency banner ── */}
      {/* ── Price ──────────────────────────────────────────────────────── */}
      {myntra && myntraTarget ? (
        <div className="space-y-2">
          <p className="font-body text-[1.35rem] font-semibold leading-none text-[var(--color-lp-ink)]">
            {selectedSize ? formatPrice(myntraTarget.price) : `From ${formatPrice(myntraTarget.price)}`}
            <span className="ml-3 font-body text-[0.95rem] font-normal text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)] align-middle">
              {formatPrice(price)}
            </span>
            <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-body font-semibold text-[0.8rem] bg-lp-success/10 text-lp-success align-middle">
              ({Math.round((1 - myntraTarget.price / price) * 100)}% off)
            </span>
          </p>
          <div className="flex items-center gap-3">
            {myntraSizeRating?.rating ? (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body font-bold text-[0.8rem] text-lp-ink bg-lp-gold/15 border border-lp-gold/40">
                <Star size={13} strokeWidth={0} className="fill-lp-gold" />
                {myntraSizeRating.rating.toFixed(1)}
                <span className="font-medium opacity-70">({myntraSizeRating.ratingCount} ratings)</span>
              </span>
            ) : null}
            <span className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)]">
              Available on Myntra
            </span>
          </div>
        </div>
      ) : (
      <div className="space-y-2">
        <p className="font-body text-[1.35rem] font-semibold leading-none text-[var(--color-lp-ink)]">
          {selectedSize ? formatPrice(price) : `From ${formatPrice(price)}`}
          {product.mrp && (
            <>
              <span className="ml-3 font-body text-[0.95rem] font-normal text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)] align-middle">
                {formatPrice(product.mrp)}
              </span>
              <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-body font-semibold text-[0.8rem] bg-lp-success/10 text-lp-success align-middle">
                ({Math.round((1 - price / product.mrp) * 100)}% off)
              </span>
            </>
          )}
        </p>
        {(manualRating || reviews.length > 0) && (
          <div className="flex items-center gap-3">
            {manualRating && (
              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body font-bold text-[0.8rem] text-lp-ink bg-lp-gold/15 border border-lp-gold/40">
                <Star size={13} strokeWidth={0} className="fill-lp-gold" />
                {manualRating.rating.toFixed(1)}
                <span className="font-medium opacity-70">({manualRating.count})</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setReviewsOpen(true)}
              className="font-body font-medium text-[0.8rem] text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] underline underline-offset-2 transition-colors duration-200"
            >
              {reviews.length > 0 ? `${reviews.length} Reviews` : 'Reviews'}
            </button>
          </div>
        )}
      </div>
      )}

      {/* ── Colour selector ────────────────────────────────────────────── */}
      <div>
        <p className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)] mb-3">
          Colour ·{' '}
          <span className="text-lp-ink font-medium">
            {variant.color}
            {variant.accentColor && (
              <span className="text-lp-ink font-normal"> | {variant.accentColor}</span>
            )}
          </span>
        </p>
        <div className="flex gap-3 flex-wrap">
          {product.variants.map((v, i) => (
            <button
              key={v.color}
              onClick={() => handleColorChange(i)}
              onMouseEnter={() => onColorHover?.(i)}
              onMouseLeave={() => onColorHover?.(null)}
              title={v.color}
              className="w-7 h-7 rounded-full transition-all duration-200"
              style={{
                background: v.bodyHex
                  ? `linear-gradient(135deg, ${v.bodyHex} 60%, ${v.colorHex} 60%)`
                  : v.colorHex,
                boxShadow: i === colorIndex
                  ? `0 0 0 2px var(--color-lp-porcelain), 0 0 0 3.5px ${swatchRingColor(v.colorHex)}`
                  : '0 0 0 1px var(--color-lp-border-strong)',
              }}
              aria-label={v.color}
              aria-pressed={i === colorIndex}
            />
          ))}
        </div>
      </div>

      {/* ── Gallery thumbnails — desktop only. On mobile this same strip
          renders inside ImageGallery instead, directly under the main
          photo; here it sits with the rest of the buy-box instead of
          getting pushed below the fold under a full-height image. Reflects
          the actually-selected colour rather than a hover-preview, to avoid
          plumbing that transient state across two sibling components for a
          cosmetic sync that self-corrects the moment the hover ends. ──── */}
      {(() => {
        const galleryImages = variant.images?.length ? variant.images : product.images
        const slides = buildGallerySlides(galleryImages, {
          youtubeId:     variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId,
          streamVideoId: product.demoVideoId,
        })
        if (slides.length <= 1) return null
        return (
          <div className="hidden md:flex gap-2 overflow-x-auto scrollbar-hide">
            {slides.map((slide, i) => (
              <button
                key={i}
                onClick={() => onGalleryAngleChange(i)}
                className={`relative shrink-0 w-16 h-21.25 overflow-hidden bg-lp-image-bg border transition-colors duration-200 ${
                  i === galleryActiveAngle
                    ? 'border-lp-gold shadow-[inset_0_0_0_1px_var(--color-lp-gold)]'
                    : 'border-lp-border hover:border-lp-border-strong'
                }`}
                aria-label={slide.type === 'video' ? `${product.name} video` : `View image ${i + 1}`}
                aria-pressed={i === galleryActiveAngle}
              >
                {slide.type === 'video' && slide.source === 'youtube' ? (
                  <>
                    <img
                      src={youtubeThumbnail(slide.youtubeId)}
                      alt={`${product.name} video thumbnail`}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play size={16} strokeWidth={0} fill="white" className="ml-0.5" />
                    </span>
                  </>
                ) : slide.type === 'video' && slide.source === 'stream' ? (
                  <>
                    <Image
                      src={cfVideoPoster(slide.videoId)}
                      alt={`${product.name} video thumbnail`}
                      fill
                      className="object-cover object-center"
                      sizes="64px"
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <Play size={16} strokeWidth={0} fill="white" className="ml-0.5" />
                    </span>
                  </>
                ) : (
                  <Image
                    src={thumbUrl(slide.src, i === 0 ? product.imageFit : undefined)}
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill
                    className="object-cover object-center"
                    sizes="64px"
                  />
                )}
              </button>
            ))}
          </div>
        )
      })()}

      {/* ── Size selector ──────────────────────────────────────────────── */}
      {!product.hideSizeSelector && (
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)]">
            Size
            {!selectedSize && (
              <span className="text-[var(--color-lp-faint)] normal-case tracking-normal ml-2">
                - Select the Size
              </span>
            )}
          </p>
          {!product.hideSizeGuide && product.category !== 'vanity' && product.variants.some(v => v.sizes.some(s => s.size !== 'One Size')) && (
            <button
              type="button"
              onClick={() => setSizeGuideOpen(true)}
              className="flex items-center gap-1 font-body font-medium text-[0.72rem] text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
            >
              <Ruler size={12} strokeWidth={1.5} />
              Size Guide
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {variant.sizes.map(({ size, stock }) => {
            const outOfStock = stock === 0
            const isSelected = selectedSize === size
            return (
              <button
                key={size}
                onClick={() => !outOfStock && setSelectedSize(size)}
                disabled={outOfStock}
                className={
                  outOfStock
                    ? 'relative font-body text-[0.75rem] px-4 py-2.5 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                    : isSelected
                    ? 'font-body text-[0.75rem] px-4 py-2.5 rounded-md border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                    : 'font-body text-[0.75rem] px-4 py-2.5 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-ink)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
                }
                aria-pressed={isSelected}
                aria-label={outOfStock ? `${size}, out of stock` : size}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>
      )}

      {/* ── Quantity stepper (hidden when purchase happens on Myntra) ──── */}
      {!myntra && (
      <div className="flex items-center gap-4">
        <p className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-lp-muted">Quantity</p>
        <div className="flex items-center border border-lp-border">
          <button
            type="button"
            onClick={() => setQuantity(q => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center text-lp-ink hover:text-lp-gold disabled:opacity-30 transition-colors duration-200"
            aria-label="Decrease quantity"
          >
            <Minus size={14} strokeWidth={1.5} />
          </button>
          <span className="w-9 text-center font-body text-[0.85rem] text-lp-ink select-none">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(q => Math.min(sizeObj?.stock ?? 10, q + 1))}
            disabled={sizeObj ? quantity >= sizeObj.stock : false}
            className="w-9 h-9 flex items-center justify-center text-lp-ink hover:text-lp-gold disabled:opacity-30 transition-colors duration-200"
            aria-label="Increase quantity"
          >
            <Plus size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
      )}

      {/* ── Buy CTA + Wishlist ─────────────────────────────────────────── */}
      <div className="flex gap-3">
        {myntra && myntraTarget ? (
          <MyntraBuyButton
            url={myntraTarget.url}
            slug={product.slug}
            size={selectedSize}
            placement="pdp"
            className="btn-ghost h-12 flex-1 justify-center"
          />
        ) : addedToCart ? (
          <>
            <a
              href={ROUTES.cart}
              className="btn-ghost h-12 flex-1 justify-center"
            >
              Go to Cart
            </a>
            <a
              href="/checkout"
              className="btn-gold flex-1 justify-center"
            >
              Checkout
            </a>
          </>
        ) : (
        <motion.button
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={
            canAdd
              ? 'btn-primary flex-1 justify-center rounded-md'
              : 'btn-primary flex-1 justify-center opacity-40 cursor-not-allowed rounded-md'
          }
          whileTap={canAdd ? tapPunch : {}}
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          {!selectedSize ? 'Select Color & Size' : 'Add to cart'}
        </motion.button>
        )}

        {/* Play — product demo video, only shown when the product has one */}
        {(product.demoVideoId || variant.demoVideoYoutubeId || product.demoVideoYoutubeId) && (
          <motion.button
            type="button"
            onClick={() => setVideoOpen(true)}
            onMouseEnter={prefetchDemoVideo}
            onTouchStart={prefetchDemoVideo}
            whileTap={tapPunch}
            className="w-14 rounded-md flex items-center justify-center bg-lp-cream border border-[var(--color-lp-border)] hover:border-[var(--color-lp-gold)] hover:bg-[var(--color-lp-gold)]/10 transition-colors duration-200 shrink-0"
            aria-label="Play product demo video"
          >
            <Play size={18} strokeWidth={1.5} className="text-[var(--color-lp-ink)]" />
          </motion.button>
        )}

        {/* Wishlist */}
        <motion.button
          type="button"
          onClick={() => {
            const adding = !wished
            toggle(product.id)
            setWished(adding)
            if (adding) {
              setBurst(true)
              setTimeout(() => setBurst(false), 1050)
            }
          }}
          whileTap={tapPunch}
          className="w-14 rounded-md flex items-center justify-center bg-lp-cream border border-[var(--color-lp-border)] hover:border-[var(--color-lp-gold)] hover:bg-[var(--color-lp-gold)]/10 transition-colors duration-200 shrink-0"
          aria-label={wished ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <span className="relative block">
            <motion.span
              className="block"
              animate={burst ? { scale: [1, 1.28, 1, 1.32, 1] } : { scale: 1 }}
              transition={{ duration: 1, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }}
            >
              <Heart
                size={18}
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
      </div>

      {/* Myntra fulfilment note */}
      {myntra && (
        <p className="font-body text-[0.75rem] text-[var(--color-lp-muted)] text-center">
          Ships &amp; sold via Myntra · easy returns and COD available
        </p>
      )}

      {/* Low stock warning */}
      {!myntra && sizeObj && sizeObj.stock > 0 && sizeObj.stock <= 5 && (
        <p className="font-body text-[0.75rem] text-[var(--color-lp-error)] text-center">
          Only {sizeObj.stock} left in stock
        </p>
      )}

      <div className="lp-hr" />

      {/* ── Description ────────────────────────────────────────────────── */}
      <p className="font-body text-[1.05rem] font-medium text-[var(--color-lp-ink)] leading-[1.7] max-w-[34rem]">
        {product.description}
      </p>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {product.features.map(({ label }) => {
          const Icon = featureIconFor(label)
          return (
            <div key={label} className="flex items-center gap-2.5">
              <span className="w-10 h-10 flex items-center justify-center rounded-full bg-lp-gold/15 border border-lp-gold/30 shrink-0">
                <Icon size={19} strokeWidth={2} className="text-[var(--color-lp-gold)]" />
              </span>
              <span className="font-body font-semibold text-[0.82rem] leading-snug text-[var(--color-lp-ink)]">{label}</span>
            </div>
          )
        })}
      </div>

      {/* ── Specifications / Warranty / Shipping / FAQ accordions ─────────── */}
      <div className="pt-2">
        <ProductAccordions product={product} />
        <Link
          href={`/compare?p=${product.slug}`}
          className="group mt-5 inline-flex items-center gap-2 font-body text-[0.72rem] tracking-[0.14em] uppercase text-[var(--color-lp-gold)]"
        >
          <span className="relative">
            Compare with other models
            <span className="absolute left-0 -bottom-1 h-px w-full bg-[var(--color-lp-gold)]/35 group-hover:bg-[var(--color-lp-gold)] transition-colors duration-300" />
          </span>
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="transition-transform duration-300 group-hover:translate-x-1"
          />
        </Link>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
      <ReviewsModal open={reviewsOpen} onClose={() => setReviewsOpen(false)} productName={product.name} reviews={reviews} />
      {(product.demoVideoId || variant.demoVideoYoutubeId || product.demoVideoYoutubeId) && (
        <DemoVideoModal
          open={videoOpen}
          onClose={() => setVideoOpen(false)}
          videoId={product.demoVideoId}
          youtubeId={variant.demoVideoYoutubeId ?? product.demoVideoYoutubeId}
        />
      )}
    </div>
  )
}
