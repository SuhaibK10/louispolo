'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductGrid.tsx
// Client component — handles category filtering with animated transitions.
// Reads from config/products.ts — swap to Supabase later without touching this.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }                from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PRODUCTS, CATEGORIES }    from '@/config/products'
import { ProductCard }             from './ProductCard'
import { cn }                      from '@/lib/utils'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'name-asc'

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Featured',           value: 'default'    },
  { label: 'Price: Low to High', value: 'price-asc'  },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A–Z',          value: 'name-asc'   },
]

function sortProducts(products: typeof PRODUCTS, sort: SortKey) {
  if (sort === 'default') return products
  return [...products].sort((a, b) => {
    const aPrice = Math.min(...a.variants.flatMap(v => v.sizes.map(s => s.price)))
    const bPrice = Math.min(...b.variants.flatMap(v => v.sizes.map(s => s.price)))
    if (sort === 'price-asc')  return aPrice - bPrice
    if (sort === 'price-desc') return bPrice - aPrice
    if (sort === 'name-asc')   return a.name.localeCompare(b.name)
    return 0
  })
}

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [sortKey, setSortKey] = useState<SortKey>('default')

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  const sorted = sortProducts(filtered, sortKey)

  return (
    <div>
      {/* ── Category filter pills ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              'font-body text-[0.7rem] tracking-widest uppercase px-4 py-2 border transition-all duration-200',
              activeCategory === value
                ? 'bg-lp-ink text-lp-porcelain border-lp-ink'
                : 'bg-transparent text-lp-muted border-lp-border hover:border-lp-ink hover:text-lp-ink'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Sort + count row ──────────────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-lp-border pb-3">
        <div className="flex items-center gap-2">
          <span className="font-body text-[0.7rem] tracking-[0.08em] uppercase text-lp-faint">Sort by</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="font-body text-[0.7rem] tracking-[0.08em] uppercase bg-transparent border border-lp-border text-lp-muted px-3 py-2 cursor-pointer hover:border-lp-ink hover:text-lp-ink transition-all duration-200 outline-none"
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
        <span className="font-body text-[0.7rem] text-lp-faint">
          {sorted.length} {sorted.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────── */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-10 md:gap-x-6 md:gap-y-14"
      >
        <AnimatePresence mode="popLayout">
          {sorted.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {sorted.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-lp-muted mb-2">
            No products found
          </p>
          <p className="font-body text-sm text-lp-faint">
            Try a different category
          </p>
        </div>
      )}
    </div>
  )
}
