'use client'

import { useEffect, useState }     from 'react'
import Image                       from 'next/image'
import Link                        from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react'
import { useWishlistStore }        from '@/store/wishlistStore'
import { PRODUCTS }                from '@/config/products'
import { cardUrl, PLACEHOLDER_URL } from '@/lib/cloudinary'
import { formatPrice }             from '@/lib/utils'
import { ROUTES }                  from '@/lib/constants'

export default function WishlistPage() {
  const ids    = useWishlistStore((s) => s.ids)
  const toggle = useWishlistStore((s) => s.toggle)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  const products = PRODUCTS.filter((p) => ids.includes(p.id))

  const lowestPrice = (p: typeof PRODUCTS[0]) =>
    Math.min(...p.variants.flatMap(v => v.sizes.map(s => s.price)))

  if (products.length === 0) {
    return (
      <div className="pt-16 md:pt-[4.5rem] min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Heart size={48} strokeWidth={1} className="text-[var(--color-lp-border)] mx-auto" />
          <h1 className="font-display text-3xl text-[var(--color-lp-ink)]">Your wishlist is empty</h1>
          <p className="font-body text-[var(--color-lp-muted)] text-sm">
            Save products you love by tapping the heart icon.
          </p>
          <Link href={ROUTES.shop} className="btn-primary inline-flex mt-4">
            Browse collection
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad" style={{ paddingTop: '1.5rem' }}>

        {/* Header */}
        <div className="mb-8 md:mb-10">
          <span className="lp-eyebrow">Saved items</span>
          <h1 className="lp-heading-lg">
            Your Wishlist
            <span className="font-body text-[1rem] text-[var(--color-lp-muted)] ml-3 font-normal">
              ({products.length} {products.length === 1 ? 'item' : 'items'})
            </span>
          </h1>
        </div>

        {/* Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-10"
          >
            {products.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                className="group"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--color-lp-cream)] mb-3">
                  <Link href={`${ROUTES.shop}/${product.slug}`}>
                    <Image
                      src={cardUrl(product.images[0]) || PLACEHOLDER_URL}
                      alt={product.name}
                      fill
                      className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                      sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                    />
                  </Link>

                  {/* Remove heart */}
                  <button
                    type="button"
                    onClick={() => toggle(product.id)}
                    className="absolute top-3 right-3 z-10 p-1"
                    aria-label="Remove from wishlist"
                  >
                    <Heart
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: '#C9A96E', fill: '#C9A96E' }}
                    />
                  </button>
                </div>

                {/* Info */}
                <p className="font-body text-[0.6rem] tracking-[0.14em] uppercase text-[var(--color-lp-faint)] mb-1">
                  {product.category === 'trolley' ? 'Trolley Bag' : product.category}
                </p>
                <Link href={`${ROUTES.shop}/${product.slug}`}>
                  <p className="font-display text-[1rem] text-[var(--color-lp-ink)] leading-tight hover:text-[var(--color-lp-gold)] transition-colors duration-200 mb-1">
                    {product.name}
                  </p>
                </Link>
                <p className="font-body text-[0.85rem] text-[var(--color-lp-ink)] mb-3">
                  From {formatPrice(lowestPrice(product))}
                </p>

                <Link
                  href={`${ROUTES.shop}/${product.slug}`}
                  className="btn-ghost w-full justify-center"
                  style={{ height: '36px' }}
                >
                  <ShoppingBag size={14} strokeWidth={1.5} />
                  View Product
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Continue shopping */}
        <div className="mt-12 pt-8 border-t border-[var(--color-lp-border)] text-center">
          <Link href={ROUTES.shop} className="btn-primary inline-flex">
            Continue Shopping
            <ArrowRight size={15} strokeWidth={1.5} />
          </Link>
        </div>

      </div>
    </div>
  )
}
