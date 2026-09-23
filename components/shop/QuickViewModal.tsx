'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image                       from 'next/image'
import Link                        from 'next/link'
import { X, ShoppingBag, Star } from 'lucide-react'
import { useEffect, useState }     from 'react'
import type { Product, ProductSize } from '@/types'
import type { Review }              from '@/config/reviews'
import { pdpUrl, thumbUrl, PLACEHOLDER_URL } from '@/lib/cloudflareImages'
import { formatPrice, swatchRingColor } from '@/lib/utils'
import { ROUTES }                   from '@/lib/constants'
import { saveShopScroll }           from '@/lib/scrollRestore'
import { tapPunch }                 from '@/lib/animations'
import { ReviewsModal }             from '@/components/ui/ReviewsModal'

interface Props {
  open:           boolean
  onClose:        () => void
  product:        Product
  activeVariant:  number
  activeSize:     ProductSize | null
  onColorChange:  (i: number) => void
  onSizeChange:   (size: ProductSize) => void
  displayImage:   string
  price:          number
  mrp?:           number  // resolved by the caller — the active size's own mrp if set, else product.mrp
  canAdd:         boolean
  addedToCart:    boolean
  onAddToCart:    (e: React.MouseEvent) => void
  manualRating?:  { rating: number; count: number }
  reviews?:       Review[]
}

export function QuickViewModal({
  open, onClose, product, activeVariant, activeSize, onColorChange, onSizeChange,
  displayImage, price, mrp, canAdd, addedToCart, onAddToCart, manualRating, reviews = [],
}: Props) {
  const [reviewsOpen, setReviewsOpen] = useState(false)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const variant = product.variants[activeVariant]
  const galleryImages = variant.images?.length ? variant.images : product.images
  const [activePhoto, setActivePhoto] = useState(0)

  // Reset to the first photo whenever the color changes, or when the
  // modal is (re)opened for a product/variant that has fewer photos than
  // whatever index was left active.
  useEffect(() => { setActivePhoto(0) }, [activeVariant])
  const activeImage = galleryImages[activePhoto] ?? galleryImages[0] ?? displayImage

  return (
    <>
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] bg-black/60 flex items-end md:items-center justify-center p-0 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full md:max-w-3xl bg-[var(--color-lp-porcelain)] max-h-[92dvh] overflow-y-auto overscroll-contain"
            data-lenis-prevent
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors"
              aria-label="Close"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Image + thumbnail strip */}
              <div>
                <div className="relative aspect-3/4 bg-lp-image-bg">
                  <Image
                    src={pdpUrl(activeImage, product.imageFit) || PLACEHOLDER_URL}
                    alt={`${product.name} in ${variant.color}`}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
                {galleryImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3">
                    {galleryImages.map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActivePhoto(i)}
                        className={`relative w-14 h-14 shrink-0 rounded-md overflow-hidden bg-lp-image-bg border transition-colors duration-200 ${i === activePhoto ? 'border-lp-ink' : 'border-[var(--color-lp-border)]'}`}
                      >
                        <Image
                          src={thumbUrl(img, product.imageFit) || PLACEHOLDER_URL}
                          alt={`${product.name} angle ${i + 1}`}
                          fill
                          className="object-cover object-center"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-6 md:p-8 flex flex-col gap-3">
                <p className="font-body font-medium text-[0.65rem] tracking-[0.08em] uppercase text-[var(--color-lp-faint)]">
                  {product.category === 'trolley' ? 'Trolley Bag' : product.category}
                </p>
                <h2 className="font-display text-[1.5rem] text-[var(--color-lp-ink)] leading-tight">
                  {product.name}
                </h2>

                {(manualRating || reviews.length > 0) && (
                  <div className="flex items-center gap-3">
                    {manualRating && (
                      <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-body font-bold text-[0.8rem] text-lp-ink bg-lp-gold/15 border border-lp-gold/40 leading-none w-fit">
                        <Star size={13} strokeWidth={0} className="fill-lp-gold" />
                        {manualRating.rating.toFixed(1)}
                        <span className="font-medium opacity-70">({manualRating.count})</span>
                      </span>
                    )}
                    {reviews.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setReviewsOpen(true)}
                        className="font-body font-medium text-[0.8rem] text-lp-faint hover:text-lp-gold underline underline-offset-2 transition-colors duration-200"
                      >
                        Reviews ({reviews.length})
                      </button>
                    )}
                  </div>
                )}

                <p className="font-body text-[1.35rem] font-semibold leading-none text-[var(--color-lp-ink)] mt-1">
                  {activeSize ? formatPrice(price) : `From ${formatPrice(price)}`}
                  {mrp && (
                    <>
                      <span className="ml-3 font-body text-[0.95rem] font-normal text-[var(--color-lp-muted)] line-through decoration-1 decoration-[var(--color-lp-muted)] align-middle">
                        {formatPrice(mrp)}
                      </span>
                      <span className="ml-2 inline-flex items-center rounded-full px-2 py-0.5 font-body font-semibold text-[0.8rem] bg-lp-success/10 text-lp-success align-middle">
                        ({Math.round((1 - price / mrp) * 100)}% off)
                      </span>
                    </>
                  )}
                </p>

                {/* Colors */}
                <div className="mt-2">
                  <p className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)] mb-2">
                    Colour · <span className="text-lp-ink font-medium">{variant.color}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    {product.variants.map((v, i) => (
                      <button
                        key={v.color}
                        type="button"
                        onClick={() => onColorChange(i)}
                        title={v.color}
                        className="w-6 h-6 rounded-full transition-all duration-200 flex-shrink-0"
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
                </div>

                {/* Sizes */}
                {!product.hideSizeSelector && (
                  <div className="mt-2">
                    <p className="font-body font-semibold text-[0.7rem] tracking-[0.09em] uppercase text-[var(--color-lp-muted)] mb-2">
                      Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {variant.sizes.map(({ size, stock }) => {
                        const outOfStock = stock === 0
                        const isSelected = activeSize === size
                        return (
                          <button
                            key={size}
                            type="button"
                            onClick={() => !outOfStock && onSizeChange(size)}
                            disabled={outOfStock}
                            className={
                              outOfStock
                                ? 'relative font-body text-[0.75rem] px-3 py-1.5 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-faint)] opacity-50 cursor-not-allowed line-through'
                                : isSelected
                                ? 'font-body text-[0.75rem] px-3 py-1.5 rounded-md border bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                                : 'font-body text-[0.75rem] px-3 py-1.5 rounded-md border border-[var(--color-lp-border)] text-[var(--color-lp-muted)] hover:border-[var(--color-lp-ink)] transition-colors duration-200'
                            }
                            aria-pressed={isSelected}
                          >
                            {size}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 flex flex-col gap-2">
                  {addedToCart ? (
                    <Link href="/checkout" className="btn-gold w-full justify-center" style={{ height: '42px' }}>
                      Checkout
                    </Link>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={onAddToCart}
                      disabled={!canAdd}
                      className={canAdd ? 'btn-ghost w-full justify-center' : 'btn-ghost w-full justify-center opacity-40 cursor-not-allowed'}
                      style={{ height: '42px' }}
                      whileTap={canAdd ? tapPunch : {}}
                    >
                      {activeSize && <ShoppingBag size={20} strokeWidth={1.5} style={{ flexShrink: 0 }} />}
                      {!activeSize ? 'Select Size' : 'Add to cart'}
                    </motion.button>
                  )}
                  <Link
                    href={`${ROUTES.shop}/${product.slug}?color=${encodeURIComponent(variant.color)}`}
                    onClick={saveShopScroll}
                    className="font-body font-medium text-[0.8rem] text-center text-[var(--color-lp-muted)] hover:text-lp-gold underline underline-offset-2 transition-colors duration-200"
                  >
                    View full details
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    <ReviewsModal open={reviewsOpen} onClose={() => setReviewsOpen(false)} productName={product.name} reviews={reviews} />
    </>
  )
}
