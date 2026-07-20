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
import { motion }                            from 'framer-motion'
import { ArrowRight, ShoppingBag, Ruler, Heart, Star } from 'lucide-react'
import type { ProductSize }                  from '@/types'
import { FEATURED_PRODUCTS }                 from '@/config/products'
import { cardUrl, PLACEHOLDER_URL }          from '@/lib/cloudinary'
import { formatPrice }                       from '@/lib/utils'
import { ROUTES }                            from '@/lib/constants'
import { useCartStore }                      from '@/store/cartStore'
import { useWishlistStore }                  from '@/store/wishlistStore'
import { staggerChildren, fadeUp, VIEWPORT } from '@/lib/animations'
import { SizeGuideModal }                    from '@/components/ui/SizeGuideModal'
import { MyntraBuyButton }                   from '@/components/ui/MyntraBuyButton'
import { getMyntraListing, getMyntraForSize } from '@/config/myntra'

// ─── Single product card ──────────────────────────────────────────────────────
function ProductCard({ product }: { product: typeof FEATURED_PRODUCTS[0] }) {
  const addItem = useCartStore((s) => s.addItem)
  const toggle  = useWishlistStore((s) => s.toggle)
  const has     = useWishlistStore((s) => s.has)
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

  const [activeVariant,  setActiveVariant]  = useState(0)
  const [activeSize,     setActiveSize]     = useState<ProductSize | null>(null)
  const [addedToCart,    setAddedToCart]    = useState(false)
  const [sizeGuideOpen,  setSizeGuideOpen]  = useState(false)

  const hasStandardSizes = !product.hideSizeGuide && product.variants.some(v => v.sizes.some(s => s.size !== 'One Size'))

  const variant      = product.variants[activeVariant]
  const displayImage = product.images[activeVariant] ?? product.images[0]
  const lowestPrice  = Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
  const sizeObj     = variant.sizes.find(s => s.size === activeSize)
  const price       = sizeObj?.price ?? lowestPrice
  const inStock     = sizeObj ? sizeObj.stock > 0 : true
  const canAdd      = activeSize !== null && inStock

  // Stocked on Myntra → CTA routes there instead of the cart
  const myntra       = getMyntraListing(product.slug)
  const myntraTarget = getMyntraForSize(product.slug, activeSize)

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
    setTimeout(() => setAddedToCart(false), 7000)
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
          src={cardUrl(displayImage) || PLACEHOLDER_URL}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width:768px) 72vw, (max-width:1024px) 40vw, 22rem"
          draggable="false"
        />
        {/* Myntra Exclusive badge */}
        {myntra && (
          <span className="absolute top-3 left-3 z-10 flex items-center justify-center backdrop-blur-sm rounded-full p-1.5 border border-[#5B6670]/60">
            <Image src="/myntra-m.png" alt="Myntra" width={13} height={11} />
          </span>
        )}
        {/* Tag */}
        {product.tag && (
          <span className={`lp-tag absolute left-3 ${myntra ? 'top-10' : 'top-3'}`}>
            {product.tag}
          </span>
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
        <div className="flex items-center justify-between pt-0.5 pr-2">
          <div className="flex gap-1.5">
            {product.variants.slice(0, 5).map((v, i) => (
              <button
                key={v.color}
                type="button"
                onClick={(e) => handleColorChange(e, i)}
                title={v.color}
                className="w-4 h-4 rounded-full transition-all duration-200 flex-shrink-0"
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
            {product.variants.length > 5 && (
              <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)] self-center">
                +{product.variants.length - 5}
              </span>
            )}
          </div>
          {hasStandardSizes && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setSizeGuideOpen(true) }}
              className="flex items-center gap-1 font-body text-[0.6rem] tracking-[0.08em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
            >
              <Ruler size={11} strokeWidth={1.5} />
              Size Guide
            </button>
          )}
        </div>

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
                      ? 'relative font-body text-[0.68rem] px-2.5 py-1 border border-lp-border text-lp-faint opacity-50 cursor-not-allowed line-through'
                      : isSelected
                      ? 'font-body text-[0.68rem] px-2.5 py-1 border bg-lp-ink text-lp-porcelain border-lp-ink'
                      : 'font-body text-[0.68rem] px-2.5 py-1 border border-lp-border text-lp-muted hover:border-lp-ink transition-colors duration-200'
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

        {/* Price — single line in both branches so Myntra and
            non-Myntra cards keep identical height and buttons align */}
        {myntra && myntraTarget ? (
          <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] pt-0.5">
            {activeSize ? formatPrice(myntraTarget.price) : `From ${formatPrice(myntraTarget.price)}`}
            <span className="ml-2 font-normal text-[0.72rem] text-[var(--color-lp-faint)] line-through">
              {activeSize ? formatPrice(price) : formatPrice(lowestPrice)}
            </span>
            <span className="ml-1.5 font-medium text-[0.72rem] text-[#5B6670]">
              ({Math.round((1 - myntraTarget.price / (activeSize ? price : lowestPrice)) * 100)}% off)
            </span>
          </p>
        ) : (
        <p className="font-body text-[0.85rem] font-medium text-[var(--color-lp-ink)] pt-0.5">
          {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
        </p>
        )}

        {/* Buy on Myntra (stocked there) or Add to cart */}
        {myntra && myntraTarget ? (
          <>
            <MyntraBuyButton
              url={myntraTarget.url}
              slug={product.slug}
              size={activeSize}
              placement="card"
              className="btn-ghost w-3/4 justify-center mt-2"
            />
            {myntra.rating ? (
              <p className="flex w-3/4 items-center justify-center gap-1 font-body text-[0.68rem] text-lp-muted">
                <Star size={11} strokeWidth={0} className="fill-[#5B6670]" />
                {myntra.rating.toFixed(1)} ({myntra.ratingCount}) · on Myntra
              </p>
            ) : (
              <p className="w-3/4 font-body text-[0.68rem] text-lp-muted text-center">on Myntra</p>
            )}
          </>
        ) : addedToCart ? (
          <div className="flex gap-1.5 mt-2">
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
                ? 'btn-ghost w-3/4 justify-center mt-2'
                : 'btn-ghost w-3/4 justify-center opacity-40 cursor-not-allowed mt-2'
            }
            style={{ height: '36px' }}
            whileTap={canAdd ? { scale: 0.97 } : {}}
          >
            <ShoppingBag size={16} strokeWidth={1.5} />
            {!activeSize ? 'Select Color & Size' : 'Add to cart'}
          </motion.button>
        )}
      </div>

      {sizeGuideOpen && createPortal(
        <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />,
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

  return (
    <section className="pt-0.5 md:pt-4 pb-20 md:pb-28 xl:pb-36 overflow-hidden">

      {/* Tabs */}
      <div className="container-lp flex items-center justify-center gap-5" style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          onClick={() => setTab('bestsellers')}
          className={
            tab === 'bestsellers'
              ? 'font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
              : 'font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-transparent pb-1.5 transition-colors duration-200'
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
              ? 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
              : 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-transparent pb-1.5 transition-colors duration-200'
          }
        >
          <Image src="/myntra-m.png" alt="" width={13} height={11} />
          Myntra Exclusives
        </button>
      </div>

      <div className="container-lp flex items-end justify-between" style={{ marginBottom: '2.5rem' }}>

        <motion.div
          key={tab}
          variants={staggerChildren}
          initial="hidden"
          whileInView="visible"
          viewport={VIEWPORT}
        >
          <motion.span variants={fadeUp} className="lp-eyebrow">
            {tab === 'myntra' ? 'Available exclusively on' : 'What India is carrying'}
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
            View all
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
          dragConstraints={{ left: -dragWidth, right: 0 }}
          dragElastic={0.05}
          dragMomentum={true}
          className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
          style={{ WebkitUserSelect: 'none' }}
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
