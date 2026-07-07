'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductCard.tsx
// Shop grid card. Color swatch selection previews the product image variant.
// Clicking navigates to PDP. Color/size is passed as query param.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Image                        from 'next/image'
import Link                         from 'next/link'
import { motion }                   from 'framer-motion'
import { ArrowRight, ShoppingBag, Check, Heart, Ruler } from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { cardUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }              from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'
import { useCartStore }             from '@/store/cartStore'
import { useWishlistStore }         from '@/store/wishlistStore'
import { SizeGuideModal }           from '@/components/ui/SizeGuideModal'

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
  const [activeSize,      setActiveSize]      = useState<ProductSize | null>(null)
  const [addedToCart,     setAddedToCart]     = useState(false)
  const [sizeGuideOpen,   setSizeGuideOpen]   = useState(false)

  const variant      = product.variants[activeVariant]
  const lowestPrice  = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const displayImage = product.images[activeVariant] ?? product.images[0]
  const sizeObj       = variant.sizes.find(s => s.size === activeSize)
  const price         = sizeObj?.price ?? lowestPrice
  const inStock       = sizeObj ? sizeObj.stock > 0 : true
  const canAdd        = activeSize !== null && inStock

  function handleColorChange(e: React.MouseEvent, i: number) {
    e.stopPropagation()
    setActiveVariant(i)
    setActiveSize(null)  // reset size when colour changes
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
      className="group"
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

        {/* Tag */}
        {product.tag && (
          <span className="lp-tag absolute top-3 left-3 z-10">{product.tag}</span>
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

        {/* Low stock badge */}
        {variant.lowStock && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 font-body text-[0.6rem] font-semibold tracking-[0.06em] text-lp-ink">
            <span className="inline-block w-1 h-1 rounded-full bg-[#C0392B] animate-blink-slow shrink-0" />
            Few Left
          </span>
        )}

        {/* Quick shop overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-[var(--color-lp-ink)]/90 backdrop-blur-sm py-3 flex items-center justify-center gap-2">
          <span className="font-body text-[0.68rem] tracking-[0.12em] uppercase text-[var(--color-lp-porcelain)]">
            View Product
          </span>
          <ArrowRight size={12} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
        </div>
      </Link>

      {/* Info */}
      <div className="space-y-1.5">
        {/* Category + name */}
        <p className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-[var(--color-lp-faint)]">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        <Link href={`${ROUTES.shop}/${product.slug}`}>
          <p className="font-display text-[1rem] md:text-[1.1rem] text-[var(--color-lp-ink)] leading-tight hover:text-[var(--color-lp-gold)] transition-colors duration-200">
            {product.name}
          </p>
        </Link>

        {/* Size chips */}
        <div className="flex items-center justify-between gap-1 pt-0.5">
          <div className="flex flex-wrap gap-1">
          {variant.sizes.map(({ size, stock }) => {
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
          <span className="font-body text-[0.58rem] tracking-[0.06em] text-lp-muted leading-none shrink-0">
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

        {/* Price */}
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)]">
          {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
        </p>

        {/* Add to cart */}
        {addedToCart ? (
          <div className="flex gap-1.5 mt-2">
            <Link
              href={ROUTES.cart}
              className="btn-ghost flex-1 justify-center"
              style={{ height: '36px' }}
            >
              Go to Cart
            </Link>
            <Link
              href="/store/checkout"
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
              ? 'btn-ghost w-full justify-center mt-2'
              : 'btn-ghost w-full justify-center opacity-40 cursor-not-allowed mt-2'
          }
          style={{ height: '36px' }}
          whileTap={canAdd ? { scale: 0.97 } : {}}
        >
          {activeSize && <ShoppingBag size={22} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
          {!activeSize ? 'Select Color & Size' : 'Add to cart'}
        </motion.button>
        )}
      </div>

      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </motion.div>
  )
}
