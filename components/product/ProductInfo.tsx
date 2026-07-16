'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductInfo.tsx
// Product detail info panel — color selector → size selector → add to cart.
// The flow is strict: select color, then select size. CTA unlocks after both.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect }   from 'react'
import { useRouter }             from 'next/navigation'
import { motion }                from 'framer-motion'
import Link                      from 'next/link'
import { ShoppingBag, Heart, Ruler, Minus, Plus, ArrowRight, Star } from 'lucide-react'
import { featureIconFor }        from '@/lib/featureIcons'
import type { Product, ProductSize } from '@/types'
import { formatPrice }           from '@/lib/utils'
import { ROUTES }                from '@/lib/constants'
import { useCartStore }          from '@/store/cartStore'
import { thumbUrl }              from '@/lib/cloudinary'
import { useWishlistStore }      from '@/store/wishlistStore'
import { SizeGuideModal }        from '@/components/ui/SizeGuideModal'
import { ProductAccordions }     from '@/components/product/ProductDetails'
import { MyntraBuyButton }       from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize } from '@/config/myntra'

interface Props {
  product: Product
  defaultColor?: string
  onColorChange?: (index: number) => void
}

export function ProductInfo({ product, defaultColor, onColorChange }: Props) {
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

  useEffect(() => { setWished(has(product.id)) }, [has, product.id])

  const [colorIndex,    setColorIndex]    = useState(Math.max(0, defaultVariantIndex))
  const [selectedSize,  setSelectedSize]  = useState<ProductSize | null>(null)
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

  function handleColorChange(i: number) {
    setColorIndex(i)
    setSelectedSize(null)
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
      image:       product.images[colorIndex] ?? product.images[0],
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

      <div>
        <p className="font-body text-[0.65rem] tracking-[0.14em] uppercase text-[var(--color-lp-muted)] mb-1">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        <h1 className="lp-heading-md">{product.name}</h1>
      </div>

      {/* ── Price ──────────────────────────────────────────────────────── */}
      {myntra && myntraTarget ? (
        <div className="space-y-2">
          <p className="font-display text-[2rem] leading-none text-[var(--color-lp-ink)]">
            {selectedSize ? formatPrice(myntraTarget.price) : `From ${formatPrice(myntraTarget.price)}`}
            <span className="ml-3 font-body text-[1rem] text-[var(--color-lp-faint)] line-through align-middle">
              {formatPrice(price)}
            </span>
            <span className="ml-2 font-body text-[0.95rem] font-medium text-[#5B6670] align-middle">
              ({Math.round((1 - myntraTarget.price / price) * 100)}% off)
            </span>
          </p>
          <div className="flex items-center gap-3">
            {myntraSizeRating?.rating ? (
              <span className="flex items-center gap-1 font-body text-[0.78rem] text-[var(--color-lp-ink)]">
                <Star size={13} strokeWidth={0} className="fill-[#5B6670]" />
                {myntraSizeRating.rating.toFixed(1)}
                <span className="text-[var(--color-lp-muted)]">({myntraSizeRating.ratingCount} ratings)</span>
              </span>
            ) : null}
            <span className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)]">
              Available on Myntra
            </span>
          </div>
        </div>
      ) : (
      <p className="font-display text-[2rem] leading-none text-[var(--color-lp-ink)]">
        {selectedSize ? formatPrice(price) : `From ${formatPrice(price)}`}
      </p>
      )}

      {/* ── Description ────────────────────────────────────────────────── */}
      <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] leading-relaxed">
        {product.description}
      </p>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-3">
        {product.features.map(({ label }) => {
          const Icon = featureIconFor(label)
          return (
            <div key={label} className="flex items-center gap-2.5">
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-[var(--color-lp-cream)] shrink-0">
                <Icon size={15} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
              </span>
              <span className="font-body text-[0.78rem] leading-snug text-[var(--color-lp-ink)]">{label}</span>
            </div>
          )
        })}
      </div>

      <div className="lp-hr" />

      {/* ── Colour selector ────────────────────────────────────────────── */}
      <div>
        <p className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-3">
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
              title={v.color}
              className="w-7 h-7 rounded-full transition-all duration-200"
              style={{
                background: v.bodyHex
                  ? `linear-gradient(135deg, ${v.bodyHex} 60%, ${v.colorHex} 60%)`
                  : v.colorHex,
                boxShadow: i === colorIndex
                  ? `0 0 0 2px var(--color-lp-porcelain), 0 0 0 3.5px ${v.colorHex}`
                  : '0 0 0 1px var(--color-lp-border)',
              }}
              aria-label={v.color}
              aria-pressed={i === colorIndex}
            />
          ))}
        </div>
      </div>

      {/* ── Size selector ──────────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)]">
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
              className="flex items-center gap-1 font-body text-[0.65rem] tracking-[0.08em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
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
                    ? 'relative font-body text-[0.75rem] px-4 py-2.5 border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                    : isSelected
                    ? 'font-body text-[0.75rem] px-4 py-2.5 border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                    : 'font-body text-[0.75rem] px-4 py-2.5 border border-[var(--color-lp-border)] text-[var(--color-lp-ink)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
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

      {/* ── Quantity stepper (hidden when purchase happens on Myntra) ──── */}
      {!myntra && (
      <div className="flex items-center gap-4">
        <p className="font-body text-[0.7rem] tracking-widest uppercase text-lp-muted">Quantity</p>
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
              className="btn-ghost flex-1 justify-center"
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
              ? 'btn-primary flex-1 justify-center'
              : 'btn-primary flex-1 justify-center opacity-40 cursor-not-allowed'
          }
          whileTap={canAdd ? { scale: 0.97 } : {}}
        >
          <ShoppingBag size={16} strokeWidth={1.5} />
          {!selectedSize ? 'Select Color & Size' : 'Add to cart'}
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
          whileTap={{ scale: 0.9 }}
          className="w-14 flex items-center justify-center border border-[var(--color-lp-border)] hover:border-[var(--color-lp-gold)] transition-colors duration-200 shrink-0"
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
    </div>
  )
}
