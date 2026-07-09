'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/compare/ComparePageClient.tsx
// Apple-style product comparison: a product switcher per column, clickable
// colour swatches that swap the column's photo, and spec rows aligned across
// columns. Two columns on mobile, three on desktop; the column headers stick
// under the navbar on every breakpoint.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }        from 'react'
import Link                 from 'next/link'
import Image                from 'next/image'
import { ChevronDown }      from 'lucide-react'
import { PRODUCTS, getProductBySlug } from '@/config/products'
import { COMPARE_ROWS, minPrice }     from '@/lib/compare'
import { cardUrl, PLACEHOLDER_URL }   from '@/lib/cloudinary'
import { formatPrice }      from '@/lib/utils'
import { ROUTES }           from '@/lib/constants'

const DEFAULT_SLUGS = ['aerosmart-3in1', 'skytrail', 'softsquare']

// Third column exists only on desktop; mobile compares two at a time.
const colClass = (col: number, base = '') =>
  `${base} ${col === 2 ? 'hidden md:block' : ''}`.trim()

const ROW_LABEL =
  'font-body text-[0.65rem] tracking-[0.16em] uppercase text-lp-muted mb-3'

export function ComparePageClient({ initialSlugs }: { initialSlugs?: string[] }) {
  const [slugs, setSlugs] = useState<string[]>(() => {
    const valid = (initialSlugs ?? []).filter(getProductBySlug)
    const fill  = DEFAULT_SLUGS.filter(s => !valid.includes(s))
    return [...valid, ...fill].slice(0, 3)
  })
  // Selected colour variant per column — resets when the column's product changes
  const [colorIdx, setColorIdx] = useState<number[]>([0, 0, 0])

  const products = slugs.map(s => getProductBySlug(s)!)

  function setColumn(col: number, slug: string) {
    setSlugs(prev => prev.map((s, i) => (i === col ? slug : s)))
    setColorIdx(prev => prev.map((c, i) => (i === col ? 0 : c)))
  }

  function setColor(col: number, idx: number) {
    setColorIdx(prev => prev.map((c, i) => (i === col ? idx : c)))
  }

  const grid = 'grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8'

  return (
    <div>

      {/* ── Sticky column headers ────────────────────────────────────────── */}
      <div className={`sticky top-16 md:top-[4.5rem] z-20 bg-lp-porcelain ${grid} pb-5 border-b border-lp-border`}>
        {products.map((product, col) => (
          <div key={col} className={colClass(col, 'pt-2')}>
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative w-24 h-32 md:w-32 md:h-42 bg-lp-cream">
                <Image
                  src={
                    cardUrl(product.images[colorIdx[col]] ?? product.images[0]) ||
                    PLACEHOLDER_URL
                  }
                  alt={`${product.name} in ${product.variants[colorIdx[col]]?.color ?? ''}`}
                  fill
                  className="object-cover object-center"
                  sizes="128px"
                />
              </div>

              {/* Product switcher */}
              <div className="relative">
                <select
                  value={product.slug}
                  onChange={(e) => setColumn(col, e.target.value)}
                  className="appearance-none bg-transparent font-display text-[0.95rem] md:text-[1.05rem] text-lp-ink text-center pr-5 cursor-pointer outline-none border-b border-transparent hover:border-lp-border-strong transition-colors duration-200"
                  aria-label={`Product in column ${col + 1}`}
                >
                  {PRODUCTS.map(p => (
                    <option key={p.slug} value={p.slug}>{p.name.trim()}</option>
                  ))}
                </select>
                <ChevronDown
                  size={13}
                  strokeWidth={1.5}
                  className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-lp-muted"
                />
              </div>

              <p className="font-body text-[0.8rem] text-lp-muted -mt-1">
                From {formatPrice(minPrice(product))}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Colours — clickable swatches swap the column photo ──────────── */}
      <div className="border-b border-lp-border py-6">
        <div className={`${grid} text-center`}>
          {products.map((product, col) => (
            <div key={col} className={colClass(col)}>
              <p className={ROW_LABEL}>Colours</p>
              <div className="flex flex-wrap justify-center gap-2.5 mb-2">
                {product.variants.map((v, i) => (
                  <button
                    key={v.color}
                    type="button"
                    onClick={() => setColor(col, i)}
                    title={v.color}
                    className="w-5 h-5 rounded-full transition-all duration-200"
                    style={{
                      background: v.bodyHex
                        ? `linear-gradient(135deg, ${v.bodyHex} 60%, ${v.colorHex} 60%)`
                        : v.colorHex,
                      boxShadow: i === colorIdx[col]
                        ? `0 0 0 2px var(--color-lp-porcelain), 0 0 0 3.5px ${v.colorHex}`
                        : '0 0 0 1px var(--color-lp-border)',
                    }}
                    aria-label={v.color}
                    aria-pressed={i === colorIdx[col]}
                  />
                ))}
              </div>
              <p className="font-body text-[0.72rem] text-lp-muted">
                {product.variants[colorIdx[col]]?.color}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Spec rows ────────────────────────────────────────────────────── */}
      {COMPARE_ROWS.map(({ key, label, extract }) => (
        <div key={key} className="border-b border-lp-border py-6">
          <div className={`${grid} text-center`}>
            {products.map((product, col) => (
              <div key={col} className={colClass(col)}>
                <p className={ROW_LABEL}>{label}</p>
                <div className="space-y-1">
                  {extract(product).lines.map((line) => (
                    <p key={line} className="font-body text-[0.78rem] leading-relaxed text-lp-ink">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── CTA row ──────────────────────────────────────────────────────── */}
      <div className={`${grid} py-8`}>
        {products.map((product, col) => (
          <div key={col} className={colClass(col)}>
            <div className="flex justify-center">
              <Link
                href={`${ROUTES.shop}/${product.slug}?color=${encodeURIComponent(product.variants[colorIdx[col]]?.color ?? '')}`}
                className="btn-ghost"
              >
                View product
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
