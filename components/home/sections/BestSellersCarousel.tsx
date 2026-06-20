'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/BestSellersCarousel.tsx
// Draggable product carousel — featured products from config/products.ts.
// Pattern adapted from B&B Appliances ProductCarousel.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState, useEffect }       from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion }                            from 'framer-motion'
import { ArrowRight, ShoppingBag, Check }    from 'lucide-react'
import type { ProductSize }                  from '@/types'
import { FEATURED_PRODUCTS }                 from '@/config/products'
import { cardUrl, PLACEHOLDER_URL }          from '@/lib/cloudinary'
import { formatPrice }                       from '@/lib/utils'
import { ROUTES }                            from '@/lib/constants'
import { useCartStore }                      from '@/store/cartStore'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
  const addItem = useCartStore((s) => s.addItem)

  const [activeVariant, setActiveVariant] = useState(0)
  const [activeSize,    setActiveSize]    = useState<ProductSize | null>(null)
  const [addedToCart,   setAddedToCart]   = useState(false)

  const variant     = product.variants[activeVariant]
  const lowestPrice = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const sizeObj     = variant.sizes.find(s => s.size === activeSize)
  const price       = sizeObj?.price ?? lowestPrice
  const inStock     = sizeObj ? sizeObj.stock > 0 : true
  const canAdd      = activeSize !== null && inStock

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
      image:       product.images[0],
      color:       variant.color,
      colorHex:    variant.colorHex,
      size:        activeSize,
      price:       sizeObj.price,
      quantity:    1,
    })

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  return (
    <div className="group flex-shrink-0 w-[68vw] sm:w-[40vw] md:w-[30vw] lg:w-[22rem]">
      {/* Image */}
      <Link
        href={`${ROUTES.shop}/${product.slug}`}
        className="relative block aspect-[3/4] bg-[var(--color-lp-cream)] overflow-hidden mb-3"
        draggable="false"
      >
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
      </Link>

      {/* Info */}
      <div className="space-y-1.5">
        <p className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-[var(--color-lp-muted)]">
          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
        </p>
        <Link href={`${ROUTES.shop}/${product.slug}`}>
          <p className="font-display text-[1.1rem] text-[var(--color-lp-ink)] leading-tight hover:text-[var(--color-lp-gold)] transition-colors duration-200">
            {product.name}
          </p>
        </Link>

        {/* Color dots */}
        <div className="flex gap-1.5 pt-0.5">
          {product.variants.slice(0, 5).map((v, i) => (
            <button
              key={v.color}
              type="button"
              onClick={(e) => handleColorChange(e, i)}
              title={v.color}
              className="w-4 h-4 rounded-full transition-all duration-200 flex-shrink-0"
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
          {product.variants.length > 5 && (
            <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)] self-center">
              +{product.variants.length - 5}
            </span>
          )}
        </div>

        {/* Size chips */}
        <div className="flex flex-wrap gap-1 pt-0.5">
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
                    ? 'relative font-body text-[0.68rem] px-2.5 py-1 border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                    : isSelected
                    ? 'font-body text-[0.68rem] px-2.5 py-1 border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                    : 'font-body text-[0.68rem] px-2.5 py-1 border border-[var(--color-lp-border)] text-[var(--color-lp-muted)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
                }
                aria-pressed={isSelected}
                aria-label={outOfStock ? `${size} — out of stock` : size}
              >
                {size}
              </button>
            )
          })}
        </div>

        {/* Price */}
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] pt-0.5">
          {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
        </p>

        {/* Add to cart */}
        <motion.button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAdd}
          className={
            canAdd
              ? addedToCart
                ? 'btn-gold w-3/4 justify-center mt-2'
                : 'btn-ghost w-3/4 justify-center mt-2'
              : 'btn-ghost w-3/4 justify-center opacity-40 cursor-not-allowed mt-2'
          }
          style={{ height: '36px' }}
          whileTap={canAdd ? { scale: 0.97 } : {}}
        >
          {addedToCart ? (
            <>
              <Check size={16} strokeWidth={2} />
              Added
            </>
          ) : (
            <>
              <ShoppingBag size={16} strokeWidth={1.5} />
              {!activeSize ? 'Select Color & Size' : 'Add to cart'}
            </>
          )}
        </motion.button>
      </div>
    </div>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function BestSellersCarousel() {
  const trackRef     = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [dragWidth, setDragWidth] = useState(0)

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
  }, [])

  return (
    <section className="pt-0.5 md:pt-4 pb-20 md:pb-28 xl:pb-36 overflow-hidden">

      {/* Scroll indicator */}
      <div className="container-lp flex flex-col items-center gap-1" style={{ marginBottom: '4.5rem' }}>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5"
            style={{ border: '1.5px solid var(--color-lp-ink)' }}
          >
            <motion.div
              animate={{ y: [0, 14, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 rounded-full bg-[var(--color-lp-ink)]"
            />
          </div>
          <span className="font-body text-[0.6rem] tracking-[0.16em] uppercase text-[var(--color-lp-ink)]">
            Swipe down to Begin the Journey
          </span>
        </motion.div>
      </div>

      <div className="container-lp flex items-end justify-between" style={{ marginBottom: '2.5rem' }}>
        
        <motion.div
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            What India is carrying
          </motion.span>
          <motion.h2 variants={fadeUp} className="lp-heading-lg">
            Our Best Sellers
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
      <div ref={containerRef} className="overflow-hidden w-full">
        <motion.div
          ref={trackRef}
          drag="x"
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragMomentum={true}
          className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitUserSelect: 'none' }}
          whileTap={{ cursor: 'grabbing' }}
        >
          {FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      </div>

      <div className="md:hidden" style={{ marginTop: '3rem' }}>
        <div className="container-lp">
          <Link href={ROUTES.shop} className="btn-outline w-full justify-center">
            View all products
          </Link>
        </div>
      </div>
    </section>
  )
}
