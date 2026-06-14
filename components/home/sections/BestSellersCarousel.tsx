'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/BestSellersCarousel.tsx
// Draggable product carousel — featured products from config/products.ts.
// Pattern adapted from B&B Appliances ProductCarousel.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef }                            from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion }                            from 'framer-motion'
import { ArrowRight }                        from 'lucide-react'
import { FEATURED_PRODUCTS }                 from '@/config/products'
import { cardUrl, PLACEHOLDER_URL }          from '@/lib/cloudinary'
import { formatPrice }                       from '@/lib/utils'
import { ROUTES }                            from '@/lib/constants'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
  const firstVariant   = product.variants[0]
  const lowestPrice    = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))

  return (
    <Link
      href={`${ROUTES.shop}/${product.slug}`}
      className="group flex-shrink-0 w-[72vw] sm:w-[40vw] md:w-[30vw] lg:w-[22rem]"
      draggable="false"
    >
      {/* Image */}
      <div className="relative aspect-[3/4] bg-[var(--color-lp-cream)] overflow-hidden mb-3">
        <Image
          src={cardUrl(product.images[0]) || PLACEHOLDER_URL}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width:768px) 72vw, (max-width:1024px) 40vw, 22rem"
          draggable="false"
        />
        {/* Tag */}
        {product.tag && (
          <span className="lp-tag absolute top-3 left-3">
            {product.tag}
          </span>
        )}
        {/* Quick shop overlay */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-350 ease-out bg-[var(--color-lp-ink)]/90 backdrop-blur-sm py-3 flex items-center justify-center gap-2">
          <span className="font-body text-[0.7rem] tracking-[0.12em] uppercase text-[var(--color-lp-porcelain)]">
            View Product
          </span>
          <ArrowRight size={13} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
        </div>
      </div>

      {/* Info */}
      <div className="space-y-1">
        <p className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-[var(--color-lp-muted)]">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        <p className="font-display text-[1.1rem] text-[var(--color-lp-ink)] leading-tight group-hover:text-[var(--color-lp-gold)] transition-colors duration-200">
          {product.name}
        </p>
        {/* Color dots */}
        <div className="flex gap-1.5 pt-0.5">
          {product.variants.slice(0, 5).map((v) => (
            <span
              key={v.color}
              title={v.color}
              className="w-3 h-3 rounded-full border border-[var(--color-lp-border)] flex-shrink-0"
              style={{ backgroundColor: v.colorHex }}
            />
          ))}
          {product.variants.length > 5 && (
            <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)] self-center">
              +{product.variants.length - 5}
            </span>
          )}
        </div>
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] pt-0.5">
          From {formatPrice(lowestPrice)}
        </p>
      </div>
    </Link>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BestSellersCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)

  return (
    <section className="section-pad overflow-hidden">
      <div className="container-lp mb-8 md:mb-10 flex items-end justify-between">
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            Curated for you
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            Best Sellers
          </motion.h2>
        </motion.div>

        <Link
          href={ROUTES.shop}
          className="hidden md:flex items-center gap-2 font-body text-[0.75rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200 group"
        >
          View all
          <ArrowRight size={14} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>

      {/* Drag-to-scroll track */}
      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={trackRef}
        dragElastic={0.08}
        className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
        style={{ WebkitUserSelect: 'none' }}
        whileTap={{ cursor: 'grabbing' }}
      >
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>

      <div className="container-lp mt-6 md:hidden">
        <Link href={ROUTES.shop} className="btn-outline w-full justify-center">
          View all products
        </Link>
      </div>
    </section>
  )
}
