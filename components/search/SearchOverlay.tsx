'use client'

import { useState, useEffect, useRef }  from 'react'
import { motion, AnimatePresence }      from 'framer-motion'
import { Search, X, ArrowRight }        from 'lucide-react'
import Image                            from 'next/image'
import Link                             from 'next/link'
import { PRODUCTS }                     from '@/config/products'
import { cardUrl, PLACEHOLDER_URL }     from '@/lib/cloudinary'
import { formatPrice }                  from '@/lib/utils'
import { ROUTES }                       from '@/lib/constants'

interface Props {
  open:    boolean
  onClose: () => void
}

export function SearchOverlay({ open, onClose }: Props) {
  const [query, setQuery]   = useState('')
  const inputRef            = useRef<HTMLInputElement>(null)

  const results = query.trim().length < 1 ? [] : PRODUCTS.filter((p) => {
    const q = query.toLowerCase()
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    )
  }).slice(0, 6)

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80)
      setQuery('')
    }
  }, [open])

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const lowestPrice = (p: typeof PRODUCTS[0]) =>
    Math.min(...p.variants.flatMap(v => v.sizes.map(s => s.price)))

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{    opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -20 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-[var(--color-lp-porcelain)] w-full max-w-2xl mx-auto mt-[5rem] md:mt-[6rem] mx-4 md:mx-auto shadow-2xl"
            style={{ maxWidth: '40rem', margin: '5rem auto 0' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Input row */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--color-lp-border)]">
              <Search size={18} strokeWidth={1.5} className="text-[var(--color-lp-muted)] shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="flex-1 bg-transparent font-body text-[1rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] outline-none"
              />
              <button
                onClick={onClose}
                className="text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] transition-colors shrink-0"
                aria-label="Close search"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            {/* Results */}
            {results.length > 0 && (
              <ul className="divide-y divide-[var(--color-lp-border)] max-h-[60vh] overflow-y-auto">
                {results.map((product) => (
                  <li key={product.id}>
                    <Link
                      href={`${ROUTES.shop}/${product.slug}`}
                      onClick={onClose}
                      className="flex items-center gap-4 px-5 py-3.5 hover:bg-[var(--color-lp-cream)] transition-colors group"
                    >
                      {/* Thumbnail */}
                      <div className="relative w-12 h-12 shrink-0 bg-[var(--color-lp-cream)] overflow-hidden">
                        <Image
                          src={cardUrl(product.images[0]) || PLACEHOLDER_URL}
                          alt={product.name}
                          fill
                          className="object-cover object-center"
                          sizes="48px"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-[0.95rem] text-[var(--color-lp-ink)] truncate group-hover:text-[var(--color-lp-gold)] transition-colors">
                          {product.name}
                        </p>
                        <p className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-muted)]">
                          {product.category === 'trolley' ? 'Trolley Bag' : product.category}
                        </p>
                      </div>

                      {/* Price + arrow */}
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-body text-[0.8rem] text-[var(--color-lp-ink)]">
                          From {formatPrice(lowestPrice(product))}
                        </span>
                        <ArrowRight size={14} strokeWidth={1.5} className="text-[var(--color-lp-gold)] opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            {/* Empty state */}
            {query.trim().length > 0 && results.length === 0 && (
              <div className="px-5 py-8 text-center">
                <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">
                  No products found for &ldquo;{query}&rdquo;
                </p>
              </div>
            )}

            {/* Hint when empty */}
            {query.trim().length === 0 && (
              <div className="px-5 py-5">
                <p className="font-body text-[0.65rem] tracking-[0.1em] uppercase text-[var(--color-lp-faint)] mb-3">
                  Popular
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Trolley', 'Backpack', 'Duffle', 'Set'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="font-body text-[0.75rem] px-3 py-1.5 border border-[var(--color-lp-border)] text-[var(--color-lp-muted)] hover:border-[var(--color-lp-ink)] hover:text-[var(--color-lp-ink)] transition-colors"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer hint */}
            <div className="px-5 py-2.5 border-t border-[var(--color-lp-border)] flex items-center justify-between">
              <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)]">
                Press ESC to close
              </span>
              <span className="font-body text-[0.6rem] text-[var(--color-lp-faint)] hidden md:block">
                ⌘K to open anytime
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
