'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/CategoryGrid.tsx
// Visual category cards with product imagery. Not text links.
// Each card is a destination mood that makes you want to travel.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect }       from 'react'
import Image                                 from 'next/image'
import Link                                  from 'next/link'
import { motion }                            from 'framer-motion'
import { ArrowUpRight, LayoutGrid, BadgePercent } from 'lucide-react'
import { ROUTES }                            from '@/lib/constants'
import { SALE_PRODUCTS }                     from '@/config/products'
import { cardUrl, PLACEHOLDER_URL }          from '@/lib/cloudinary'
import { staggerChildren, scaleUp, VIEWPORT } from '@/lib/animations'
import { ProductCard }                       from '@/components/shop/ProductCard'




// Category card data — images are Cloudinary public_ids
// Replace with real product images once uploaded
const CATEGORY_CARDS = [
  {
    label:    'Trolley Bags',
    value:    'trolley',
    image:    'Generated_Image_June_21_2026_-_2_58AM_xtfwjz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: 'scale-125',
  },
  {
    label:    'Sets',
    value:    'set',
    image:    'Generated_Image_June_21_2026_-_3_01AM_no4abz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: 'scale-125',
  },
  {
    label:    'Backpacks',
    value:    'backpack',
    image:    'Generated_Image_June_18_2026_-_2_00AM_jssdry.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Office Bags',
    value:    'office-bag',
    image:    'Generated_Image_June_18_2026_-_2_56AM_fubmpz.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Duffle Bags',
    value:    'duffle',
    image:    'Generated_Image_June_18_2026_-_1_53AM_jpxswo.jpg',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
  {
    label:    'Vanity Cases',
    value:    'vanity',
    image:    'Screenshot_2026-06-18_at_3.35.17_AM_cu1ffy.png',
    span:     '',
    textPos:  'bottom',
    imgClass: '',
  },
] as const

type Tab = 'category' | 'sale'

export function CategoryGrid() {
  const [tab, setTab] = useState<Tab>('category')

  const saleTrackRef     = useRef<HTMLDivElement>(null)
  const saleContainerRef = useRef<HTMLDivElement>(null)
  const [saleDragWidth, setSaleDragWidth] = useState(0)

  useEffect(() => {
    if (tab !== 'sale' || !saleTrackRef.current || !saleContainerRef.current) return
    const calculate = () => {
      if (saleTrackRef.current && saleContainerRef.current) {
        setSaleDragWidth(saleTrackRef.current.scrollWidth - saleContainerRef.current.offsetWidth)
      }
    }
    calculate()
    const ro = new ResizeObserver(calculate)
    ro.observe(saleTrackRef.current)
    return () => ro.disconnect()
  }, [tab])

  return (
    <section
      className={tab === 'sale' ? 'section-pad bg-[var(--color-lp-porcelain)]' : 'section-pad bg-[var(--color-lp-cream)]'}
      style={{ paddingTop: '0.25rem' }}
    >
      <div className="container-lp">

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-1" style={{ marginTop: '0.75rem', marginBottom: '4.5rem' }}>
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
                className="w-1 h-1.5 rounded-full bg-lp-ink"
              />
            </div>
            <span className="font-body text-[0.6rem] tracking-[0.16em] uppercase text-lp-ink">
              Swipe down to Begin the Journey
            </span>
          </motion.div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-5 mb-6 md:mb-8"
        >
          <button
            type="button"
            onClick={() => setTab('category')}
            className={
              tab === 'category'
                ? 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
                : 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-muted border-b-2 border-transparent pb-1.5 transition-colors duration-200 hover:text-lp-ink'
            }
          >
            <LayoutGrid size={13} strokeWidth={1.5} />
            Shop by Category
          </button>
          <span className="text-lp-border">|</span>
          <button
            type="button"
            onClick={() => setTab('sale')}
            className={
              tab === 'sale'
                ? 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-ink border-b-2 border-lp-ink pb-1.5 transition-colors duration-200'
                : 'flex items-center gap-1.5 font-body text-[0.75rem] tracking-widest uppercase text-lp-muted border-b-2 border-transparent pb-1.5 transition-colors duration-200 hover:text-lp-ink'
            }
          >
            <BadgePercent size={13} strokeWidth={1.5} />
            Sale
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          key={`header-${tab}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-10"
        >
          <span className="lp-eyebrow">{tab === 'sale' ? 'Limited time only' : 'Find your bag'}</span>
          <h2 className="lp-heading-lg whitespace-nowrap text-[1.6rem] md:text-[2.25rem]">{tab === 'sale' ? 'Lowest Price Ever' : 'Something for Everyone'}</h2>
        </motion.div>

        {tab === 'category' && (
          /* Category grid */
          <motion.div
            key="grid-category"
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={VIEWPORT}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4"
          >
            {CATEGORY_CARDS.map(({ label, value, image, span, imgClass }) => (
              <motion.div
                key={value}
                variants={scaleUp}
                className={span}
              >
                <Link
                  href={`${ROUTES.shop}?category=${value}`}
                  className="group relative block aspect-[4/5] md:aspect-square overflow-hidden bg-lp-border rounded-xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-xl hover:shadow-lp-ink/15 active:scale-[0.985]"
                >
                  {/* Hover frame — ink border draws in */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 z-10 rounded-xl border-[1.5px] border-lp-ink opacity-0 scale-[0.98] group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 ease-out pointer-events-none"
                  />
                  {/* Image */}
                  <Image
                    src={cardUrl(image) || PLACEHOLDER_URL}
                    alt={label}
                    fill
                    className={`object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${imgClass}`}
                    sizes="(max-width:768px) 50vw, (max-width:1280px) 25vw, 22rem"
                  />

                  {/* Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-lp-ink/90 via-lp-ink/30 to-transparent transition-opacity duration-300 group-hover:opacity-100" />

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-5">
                    <div className="flex items-end justify-between">
                      <h3 className="font-display text-[1.25rem] md:text-[1.5rem] text-[var(--color-lp-porcelain)] leading-none">
                        {label}
                      </h3>
                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.5}
                        className="text-[var(--color-lp-porcelain)]/50 group-hover:text-[var(--color-lp-gold)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200 flex-shrink-0"
                      />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {tab === 'sale' && (
        /* Sale-exclusive products — full-bleed drag-to-scroll carousel, same as Best Sellers */
        <div ref={saleContainerRef} className="overflow-hidden w-full">
          <motion.div
            key="grid-sale"
            ref={saleTrackRef}
            drag="x"
            dragConstraints={{ left: -saleDragWidth, right: 0 }}
            dragElastic={0.05}
            dragMomentum={true}
            className="flex gap-4 md:gap-6 pl-[max(1.25rem,calc((100vw-88rem)/2+4rem))] pr-6 cursor-grab active:cursor-grabbing select-none"
            style={{ WebkitUserSelect: 'none' }}
            whileTap={{ cursor: 'grabbing' }}
          >
            {SALE_PRODUCTS.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[68vw] sm:w-[40vw] md:w-[30vw] lg:w-[22rem]">
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      )}
    </section>
  )
}
