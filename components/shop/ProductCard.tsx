'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductCard.tsx
// Shop grid card. Color swatch selection previews the product image variant.
// Clicking navigates to PDP. Color/size is passed as query param.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }                 from 'react'
import Image                        from 'next/image'
import Link                         from 'next/link'
import { motion }                   from 'framer-motion'
import { ArrowRight }               from 'lucide-react'
import type { Product }             from '@/types'
import { cardUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }              from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [activeVariant, setActiveVariant] = useState(0)

  const variant      = product.variants[activeVariant]
  const lowestPrice  = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const displayImage = product.images[activeVariant] ?? product.images[0]

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
        <Image
          src={cardUrl(displayImage) || PLACEHOLDER_URL}
          alt={`${product.name} — ${variant.color}`}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
        />

        {/* Tag */}
        {product.tag && (
          <span className="lp-tag absolute top-3 left-3 z-10">{product.tag}</span>
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
        <div className="flex flex-wrap gap-1 pt-0.5">
          {product.variants[activeVariant].sizes.map(({ size }) => (
            <span
              key={size}
              className="font-body text-[0.6rem] px-2 py-0.5 border border-[var(--color-lp-border)] text-[var(--color-lp-muted)]"
            >
              {size}
            </span>
          ))}
        </div>

        {/* Color swatches */}
        <div className="flex items-center gap-1.5 pt-0.5">
          {product.variants.map((v, i) => (
            <button
              key={v.color}
              onClick={() => setActiveVariant(i)}
              title={v.color}
              className="w-3.5 h-3.5 rounded-full transition-all duration-200 flex-shrink-0"
              style={{
                backgroundColor: v.colorHex,
                boxShadow: i === activeVariant
                  ? `0 0 0 1.5px var(--color-lp-porcelain), 0 0 0 3px ${v.colorHex}`
                  : '0 0 0 1px var(--color-lp-border)',
              }}
              aria-label={v.color}
              aria-pressed={i === activeVariant}
            />
          ))}
        </div>

        {/* Price */}
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)]">
          From {formatPrice(lowestPrice)}
        </p>
      </div>
    </motion.div>
  )
}
