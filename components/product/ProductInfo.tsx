'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/product/ProductInfo.tsx
// Product detail info panel — color selector → size selector → add to cart.
// The flow is strict: select color, then select size. CTA unlocks after both.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }              from 'react'
import { useRouter }             from 'next/navigation'
import { motion }                from 'framer-motion'
import { ShoppingBag, Check }    from 'lucide-react'
import type { Product, ProductSize } from '@/types'
import { formatPrice }           from '@/lib/utils'
import { ROUTES }                from '@/lib/constants'
import { useCartStore }          from '@/store/cartStore'
import { thumbUrl }              from '@/lib/cloudinary'

interface Props {
  product: Product
  defaultColor?: string
}

export function ProductInfo({ product, defaultColor }: Props) {
  const router        = useRouter()
  const addItem       = useCartStore((s) => s.addItem)

  const defaultVariantIndex = defaultColor
    ? product.variants.findIndex(v => v.color.toLowerCase() === defaultColor.toLowerCase())
    : 0

  const [colorIndex,    setColorIndex]    = useState(Math.max(0, defaultVariantIndex))
  const [selectedSize,  setSelectedSize]  = useState<ProductSize | null>(null)
  const [addedToCart,   setAddedToCart]   = useState(false)

  const variant  = product.variants[colorIndex]
  const sizeObj  = variant.sizes.find(s => s.size === selectedSize)
  const price    = sizeObj?.price ?? Math.min(...variant.sizes.map(s => s.price))
  const inStock  = sizeObj ? sizeObj.stock > 0 : true
  const canAdd   = selectedSize !== null && inStock

  function handleColorChange(i: number) {
    setColorIndex(i)
    setSelectedSize(null)  // reset size when colour changes
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
      quantity:    1,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2200)
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
      <p className="font-display text-[2rem] leading-none text-[var(--color-lp-ink)]">
        {selectedSize ? formatPrice(price) : `From ${formatPrice(price)}`}
      </p>

      {/* ── Description ────────────────────────────────────────────────── */}
      <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] leading-relaxed">
        {product.description}
      </p>

      {/* ── Features ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        {product.features.map(({ label }) => (
          <div key={label} className="flex items-center gap-2">
            <Check size={13} strokeWidth={2} className="text-[var(--color-lp-gold)] flex-shrink-0" />
            <span className="font-body text-[0.78rem] text-[var(--color-lp-ink)]">{label}</span>
          </div>
        ))}
      </div>

      <div className="lp-hr" />

      {/* ── Colour selector ────────────────────────────────────────────── */}
      <div>
        <p className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-3">
          Colour — <span className="text-[var(--color-lp-ink)] font-medium">{variant.color}</span>
        </p>
        <div className="flex gap-3 flex-wrap">
          {product.variants.map((v, i) => (
            <button
              key={v.color}
              onClick={() => handleColorChange(i)}
              title={v.color}
              className="w-7 h-7 rounded-full transition-all duration-200"
              style={{
                backgroundColor: v.colorHex,
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
        <p className="font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] mb-3">
          Size
          {!selectedSize && (
            <span className="text-[var(--color-lp-faint)] normal-case tracking-normal ml-2">
              — please select
            </span>
          )}
        </p>
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
                aria-label={outOfStock ? `${size} — out of stock` : size}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Add to cart ────────────────────────────────────────────────── */}
      <motion.button
        onClick={handleAddToCart}
        disabled={!canAdd}
        className={
          canAdd
            ? addedToCart
              ? 'btn-gold w-full justify-center'
              : 'btn-primary w-full justify-center'
            : 'btn-primary w-full justify-center opacity-40 cursor-not-allowed'
        }
        whileTap={canAdd ? { scale: 0.97 } : {}}
      >
        {addedToCart ? (
          <>
            <Check size={16} strokeWidth={2} />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingBag size={16} strokeWidth={1.5} />
            {!selectedSize ? 'Select a size' : 'Add to cart'}
          </>
        )}
      </motion.button>

      {/* Low stock warning */}
      {sizeObj && sizeObj.stock > 0 && sizeObj.stock <= 5 && (
        <p className="font-body text-[0.75rem] text-[var(--color-lp-error)] text-center">
          Only {sizeObj.stock} left in stock
        </p>
      )}
    </div>
  )
}
