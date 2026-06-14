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

export function ProductGrid() {
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filtered = activeCategory === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === activeCategory)

  return (
    <div>
      {/* ── Category filter pills ─────────────────────────────────────── */}
      <div className="flex items-center gap-2 flex-wrap mb-8 md:mb-10">
        {CATEGORIES.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setActiveCategory(value)}
            className={cn(
              'font-body text-[0.7rem] tracking-[0.1em] uppercase px-4 py-2 border transition-all duration-200',
              activeCategory === value
                ? 'bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] border-[var(--color-lp-ink)]'
                : 'bg-transparent text-[var(--color-lp-muted)] border-[var(--color-lp-border)] hover:border-[var(--color-lp-ink)] hover:text-[var(--color-lp-ink)]'
            )}
          >
            {label}
          </button>
        ))}

        {/* Product count */}
        <span className="ml-auto font-body text-[0.7rem] text-[var(--color-lp-faint)]">
          {filtered.length} {filtered.length === 1 ? 'product' : 'products'}
        </span>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────── */}
      <motion.div
        layout
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-24 text-center">
          <p className="font-display text-2xl text-[var(--color-lp-muted)] mb-2">
            No products found
          </p>
          <p className="font-body text-sm text-[var(--color-lp-faint)]">
            Try a different category
          </p>
        </div>
      )}
    </div>
  )
}
