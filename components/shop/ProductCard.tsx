'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductCard.tsx
// Shop grid card. Color swatch selection previews the product image variant.
// Clicking navigates to PDP. Color/size is passed as query param.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Image                        from 'next/image'
import Link                         from 'next/link'
import { motion, AnimatePresence }  from 'framer-motion'
import { ArrowRight, ShoppingBag, Check, Heart, Ruler, Star, ChevronDown } from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { cardUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }              from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'
import { useCartStore }             from '@/store/cartStore'
import { useWishlistStore }         from '@/store/wishlistStore'
import { SizeGuideModal }           from '@/components/ui/SizeGuideModal'
import { MyntraBuyButton }          from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize } from '@/config/myntra'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem  = useCartStore((s) => s.addItem)
  const toggle   = useWishlistStore((s) => s.toggle)
  const has      = useWishlistStore((s) => s.has)
  const [wished, setWished] = useState(false)
  const [burst,  setBurst]  = useState(false)

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
  const [activeSize,      setActiveSize]      = useState<ProductSize | null>(
    product.hideSizeSelector ? product.variants[0].sizes[0].size : null
  )
  const [addedToCart,     setAddedToCart]     = useState(false)
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false)
  const [detailsOpen,     setDetailsOpen]     = useState(false)

  const variant      = product.variants[activeVariant]
  const lowestPrice  = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const displayImage = variant.images?.[0] ?? product.images[activeVariant] ?? product.images[0]
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
    setActiveSize(product.hideSizeSelector ? product.variants[i].sizes[0].size : null)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.4 }}
      className="group flex flex-col"
    >
      {/* Image container */}
      <Link
        href={`${ROUTES.shop}/${product.slug}?color=${encodeURIComponent(variant.color)}`}
        className="relative block aspect-[3/4] overflow-hidden bg-[var(--color-lp-cream)] mb-3"
      >
        <div
          className="absolute inset-0"
          style={product.cardZoom ? { transform: `scale(${product.cardZoom})` } : undefined}
        >
          <Image
            src={cardUrl(displayImage) || PLACEHOLDER_URL}
            alt={`${product.name} in ${variant.color}`}
            fill
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
          />
        </div>

        {/* Myntra Exclusive badge */}
        {myntra && (
          <span className="absolute top-2.5 left-2.5 md:top-3 md:left-3 z-10 flex items-center justify-center backdrop-blur-sm rounded-full p-1.5 border border-[#5B6670]/60">
            <Image src="/myntra-m.png" alt="Myntra" width={13} height={11} />
          </span>
        )}

        {/* Tag */}
        {product.tag && (
          <span className={`lp-tag absolute left-3 z-10 ${myntra ? 'top-10' : 'top-3'}`}>{product.tag}</span>
        )}

        {/* Wishlist heart */}
        <motion.button
          type="button"
          onClick={handleWishlist}
          whileTap={{ scale: 0.75 }}
          className="absolute top-3 right-3 z-10 p-1"
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

        {/* Quick shop overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--color-lp-ink)]/90 backdrop-blur-sm py-3 flex items-center justify-center gap-2">
          <span className="font-body text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-lp-porcelain)]">
            View Product
          </span>
          <ArrowRight size={12} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
        </div>
      </Link>

      {/* Info — flex column filling the card so the CTA row can pin to the
          bottom and stay aligned across cards whose content wraps differently */}
      <div className="flex-1 flex flex-col space-y-1.5">
        {/* Category + name */}
        <p className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-[var(--color-lp-faint)]">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        {/* Name left · Myntra rating right, on the same line */}
        <div className="flex items-center justify-between gap-2">
          <Link href={`${ROUTES.shop}/${product.slug}`}>
            <p className="font-display text-[1rem] md:text-[1.1rem] text-[var(--color-lp-ink)] leading-tight hover:text-[var(--color-lp-gold)] transition-colors duration-200">
              {product.name}
            </p>
          </Link>
          {myntra?.rating && (
            <span className="flex items-center gap-1 font-body text-[0.62rem] text-lp-muted leading-none shrink-0">
              <Star size={10} strokeWidth={0} className="fill-[#5B6670]" />
              {myntra.rating.toFixed(1)} ({myntra.ratingCount})
            </span>
          )}
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
                    ? 'relative font-body text-[0.6rem] px-2 py-0.5 border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                    : isSelected
                    ? 'font-body text-[0.6rem] px-2 py-0.5 border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                    : 'font-body text-[0.6rem] px-2 py-0.5 border border-[var(--color-lp-border)] text-[var(--color-lp-muted)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
                }
                aria-pressed={isSelected}
                aria-label={outOfStock ? `${size}, out of stock` : size}
              >
                {size}
              </button>
            )
          })}
          </div>
          <span className="hidden sm:inline font-body text-[0.58rem] tracking-[0.06em] text-lp-muted leading-none shrink-0">
            {variant.color}
            {variant.accentColor && (
              <span className="text-lp-faint"> | {variant.accentColor}</span>
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
                    title={v.color}
                    className="w-3.5 h-3.5 rounded-full transition-all duration-200 flex-shrink-0"
                    style={{
                      background: v.bodyHex
                        ? `linear-gradient(135deg, ${v.bodyHex} 60%, ${v.colorHex} 60%)`
                        : v.colorHex,
                      boxShadow: i === activeVariant
                        ? `0 0 0 1.5px var(--color-lp-porcelain), 0 0 0 3px ${v.colorHex}`
                        : '0 0 0 1px var(--color-lp-border)',
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
                  className="flex items-center gap-1 font-body text-[0.55rem] tracking-[0.08em] uppercase text-[var(--color-lp-faint)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                >
                  <Ruler size={10} strokeWidth={1.5} />
                  Size Guide
                </button>
              )}
            </div>
          )
        })()}

        {/* View details — reveals the short product description inline */}
        {product.description && (
          <div className="pt-0.5">
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setDetailsOpen((o) => !o) }}
              className="flex items-center gap-1 font-body text-[0.55rem] tracking-[0.08em] uppercase text-[var(--color-lp-faint)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
              aria-expanded={detailsOpen}
            >
              View details
              <ChevronDown
                size={11}
                strokeWidth={1.5}
                className={`transition-transform duration-200 ${detailsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                  className="overflow-hidden"
                >
                  <p className="font-body text-[0.72rem] leading-relaxed text-[var(--color-lp-muted)] pt-1.5">
                    {product.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Price — single line in both branches so Myntra and
            non-Myntra cards keep identical height and buttons align */}
        {myntra && myntraTarget ? (
          <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] whitespace-nowrap">
            {activeSize ? formatPrice(myntraTarget.price) : `From ${formatPrice(myntraTarget.price)}`}
            <span className="hidden sm:inline ml-2 font-normal text-[0.72rem] text-[var(--color-lp-faint)] line-through decoration-1 decoration-lp-border-strong">
              {activeSize ? formatPrice(price) : formatPrice(lowestPrice)}
            </span>
            <span className="ml-1.5 font-medium text-[0.72rem] text-[#5B6670]">
              ({Math.round((1 - myntraTarget.price / (activeSize ? price : lowestPrice)) * 100)}% off)
            </span>
          </p>
        ) : product.mrp ? (
          <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] whitespace-nowrap">
            {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
            <span className="hidden sm:inline ml-2 font-normal text-[0.72rem] text-[var(--color-lp-faint)] line-through decoration-1 decoration-lp-border-strong">
              {formatPrice(product.mrp)}
            </span>
            <span className="ml-1.5 font-medium text-[0.72rem] text-[#5B6670]">
              ({Math.round((1 - (activeSize ? price : lowestPrice) / product.mrp) * 100)}% off)
            </span>
          </p>
        ) : (
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)]">
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
            <div className="flex gap-1.5">
              <Link
                href={ROUTES.cart}
                className="btn-ghost flex-1 justify-center"
                style={{ height: '36px' }}
              >
                Go to Cart
              </Link>
              <Link
                href="/checkout"
                className="btn-gold flex-1 justify-center"
                style={{ height: '36px' }}
              >
                Checkout
              </Link>
            </div>
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
            whileTap={canAdd ? { scale: 0.97 } : {}}
          >
            {activeSize && <ShoppingBag size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
            {!activeSize ? 'Select Color & Size' : 'Add to cart'}
          </motion.button>
          )}
        </div>
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </motion.div>
  )
}
