'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/shop/ProductGrid.tsx
// Client component — handles category/price/size/colour filtering, sorting,
// and grid/list view. UI pattern modelled on puma.in's mobile filter bar:
// FILTERS + SORT buttons, a result count row, then the product grid.
// Reads from config/products.ts — swap to Supabase later without touching this.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useMemo, useRef } from 'react'
import { useSearchParams }         from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { SlidersHorizontal, LayoutGrid, Rows3 } from 'lucide-react'
import { PRODUCTS, CATEGORIES }    from '@/config/products'
import { getMyntraListing }        from '@/config/myntra'
import { SIZE_ORDER }              from '@/lib/constants'
import { useShopFilterStore }      from '@/store/shopFilterStore'
import { ProductCard }             from './ProductCard'
import { SortDropdown }            from './SortDropdown'
import { FilterDrawer, type PriceRange } from './FilterDrawer'
import { cn }                      from '@/lib/utils'

type SortKey = 'default' | 'price-asc' | 'price-desc' | 'best-sellers' | 'new-arrivals' | 'myntra-exclusives'
type ViewMode = 'grid' | 'list'

const SORT_OPTIONS: { label: string; value: SortKey }[] = [
  { label: 'Recommended',        value: 'default'            },
  { label: 'Price: Low to High', value: 'price-asc'          },
  { label: 'Price: High to Low', value: 'price-desc'         },
  { label: 'Best Sellers',       value: 'best-sellers'       },
  { label: 'New Arrivals',       value: 'new-arrivals'       },
  { label: 'Myntra Exclusives',  value: 'myntra-exclusives'  },
]

const PRICE_RANGES: PriceRange[] = [
  { label: 'Under ₹3,000',        min: 0,     max: 3000  },
  { label: '₹3,000 – ₹6,000',     min: 3000,  max: 6000  },
  { label: '₹6,000 – ₹10,000',    min: 6000,  max: 10000 },
  { label: '₹10,000 – ₹15,000',   min: 10000, max: 15000 },
  { label: 'Above ₹15,000',       min: 15000, max: null  },
]

function lowestPrice(product: typeof PRODUCTS[0]) {
  return Math.min(...product.variants.flatMap(v => v.sizes.map(s => s.price)))
}

function sortProducts(products: typeof PRODUCTS, sort: SortKey) {
  if (sort === 'default') return products

  // No "added on" date on Product — catalogue order is the closest signal
  // we have for recency, so newest-added (last in the array) surfaces first.
  if (sort === 'new-arrivals') return [...products].reverse()

  return [...products].sort((a, b) => {
    if (sort === 'price-asc')         return lowestPrice(a) - lowestPrice(b)
    if (sort === 'price-desc')        return lowestPrice(b) - lowestPrice(a)
    if (sort === 'best-sellers')      return Number(!!b.isFeatured) - Number(!!a.isFeatured)
    if (sort === 'myntra-exclusives') return Number(!!getMyntraListing(b.slug)) - Number(!!getMyntraListing(a.slug))
    return 0
  })
}

export function ProductGrid() {
  // ?category= deep links (footer, home category cards) select the filter
  const searchParams  = useSearchParams()
  const categoryParam = searchParams.get('category') ?? 'all'
  const validCategory = CATEGORIES.some(c => c.value === categoryParam) ? categoryParam : 'all'

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    validCategory === 'all' ? [] : [validCategory]
  )
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null)
  const [selectedSizes, setSelectedSizes]           = useState<string[]>([])
  const [selectedColors, setSelectedColors]         = useState<string[]>([])
  const [sortKey, setSortKey]     = useState<SortKey>('default')
  const [viewMode, setViewMode]   = useState<ViewMode>('grid')

  // Drawer open state lives in a shared store, not local state — the
  // Navbar's docked filter icon (shown once this button scrolls out of
  // view) needs to open the exact same drawer.
  const drawerOpen           = useShopFilterStore(s => s.drawerOpen)
  const setDrawerOpen        = useShopFilterStore(s => s.setDrawerOpen)
  const setInPageButtonVisible = useShopFilterStore(s => s.setInPageButtonVisible)

  const filterButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setSelectedCategories(validCategory === 'all' ? [] : [validCategory])
  }, [validCategory])

  // Track whether the in-page Filters button is visible below the sticky
  // navbar. rootMargin's negative top roughly matches the navbar's own
  // height, so the button counts as "gone" once it's scrolled under it,
  // not just once it's off the raw viewport.
  useEffect(() => {
    const el = filterButtonRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => setInPageButtonVisible(entry.isIntersecting),
      { rootMargin: '-90px 0px 0px 0px', threshold: 0 }
    )
    io.observe(el)
    return () => {
      io.disconnect()
      // Reset on unmount (route change) so neither state leaks into the next
      // visit: other pages shouldn't inherit "hidden", and revisiting /shop
      // shouldn't have the drawer auto-open from a previous session.
      setInPageButtonVisible(true)
      setDrawerOpen(false)
    }
  }, [setInPageButtonVisible, setDrawerOpen])

  // ── Derived filter option lists ─────────────────────────────────────────
  const availableSizes = useMemo(() => {
    const present = new Set<string>()
    PRODUCTS.forEach(p => p.variants.forEach(v => v.sizes.forEach(s => present.add(s.size))))
    return SIZE_ORDER.filter(s => present.has(s))
  }, [])

  const availableColors = useMemo(() => {
    const map = new Map<string, string>()
    PRODUCTS.forEach(p => p.variants.forEach(v => {
      if (!map.has(v.color)) map.set(v.color, v.colorHex)
    }))
    return Array.from(map, ([name, hex]) => ({ name, hex })).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  const categoryOptions = CATEGORIES.filter(c => c.value !== 'all')

  // ── Filtering ────────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const range = PRICE_RANGES.find(r => r.label === selectedPriceRange)

    return PRODUCTS.filter(product => {
      if (selectedCategories.length && !selectedCategories.includes(product.category)) return false

      if (range) {
        const price = lowestPrice(product)
        if (price < range.min || (range.max !== null && price > range.max)) return false
      }

      if (selectedSizes.length) {
        const hasSize = product.variants.some(v => v.sizes.some(s => selectedSizes.includes(s.size)))
        if (!hasSize) return false
      }

      if (selectedColors.length) {
        const hasColor = product.variants.some(v => selectedColors.includes(v.color))
        if (!hasColor) return false
      }

      return true
    })
  }, [selectedCategories, selectedPriceRange, selectedSizes, selectedColors])

  const sorted = sortProducts(filtered, sortKey)

  const activeFilterCount =
    selectedCategories.length + selectedSizes.length + selectedColors.length + (selectedPriceRange ? 1 : 0)

  function toggleInList(list: string[], value: string, setList: (v: string[]) => void) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  function clearAll() {
    setSelectedCategories([])
    setSelectedPriceRange(null)
    setSelectedSizes([])
    setSelectedColors([])
  }

  return (
    <div>
      {/* ── Filters + Sort row ────────────────────────────────────────── */}
      <div className="flex items-stretch gap-3 mb-4">
        <button
          ref={filterButtonRef}
          type="button"
          onClick={() => setDrawerOpen(true)}
          className="relative flex-1 flex items-center justify-center gap-2 font-body text-[0.7rem] tracking-widest uppercase text-lp-ink border border-lp-muted rounded-md px-4 py-3 hover:border-lp-ink transition-colors duration-200"
        >
          <SlidersHorizontal size={14} strokeWidth={1.5} />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-lp-gold text-lp-ink text-[0.62rem] font-medium flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <SortDropdown options={SORT_OPTIONS} value={sortKey} onChange={setSortKey} />
      </div>

      {/* ── Count + view toggle row ───────────────────────────────────── */}
      <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-lp-border pb-3">
        <span className="font-body text-[0.7rem] tracking-[0.08em] uppercase text-lp-faint">
          {sorted.length} {sorted.length === 1 ? 'Product' : 'Products'}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
            aria-label="List view"
            className={cn('p-1.5 border transition-colors duration-150', viewMode === 'list' ? 'border-lp-ink text-lp-ink' : 'border-lp-border text-lp-faint hover:text-lp-ink')}
          >
            <Rows3 size={15} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
            aria-label="Grid view"
            className={cn('p-1.5 border transition-colors duration-150', viewMode === 'grid' ? 'border-lp-ink text-lp-ink' : 'border-lp-border text-lp-faint hover:text-lp-ink')}
          >
            <LayoutGrid size={15} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* ── Product grid ──────────────────────────────────────────────── */}
      <motion.div
        layout
        className={cn(
          'grid gap-x-2 gap-y-10 md:gap-x-6 md:gap-y-14',
          viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2'
        )}
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
            Try adjusting or clearing your filters
          </p>
        </div>
      )}

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        resultCount={sorted.length}
        categories={categoryOptions}
        selectedCategories={selectedCategories}
        onToggleCategory={(value) => toggleInList(selectedCategories, value, setSelectedCategories)}
        priceRanges={PRICE_RANGES}
        selectedPriceRange={selectedPriceRange}
        onSelectPriceRange={setSelectedPriceRange}
        sizes={availableSizes}
        selectedSizes={selectedSizes}
        onToggleSize={(size) => toggleInList(selectedSizes, size, setSelectedSizes)}
        colors={availableColors}
        selectedColors={selectedColors}
        onToggleColor={(name) => toggleInList(selectedColors, name, setSelectedColors)}
        onClearAll={clearAll}
      />
    </div>
  )
}
