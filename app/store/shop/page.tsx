// ─────────────────────────────────────────────────────────────────────────────
// app/store/shop/page.tsx
// Shop page — server component. ProductGrid is client for filtering.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }        from 'next'
import { Suspense }             from 'react'
import { ProductGrid }          from '@/components/shop/ProductGrid'
import { ShopSizeGuideButton }  from '@/components/shop/ShopSizeGuideButton'

export const metadata: Metadata = {
  title:       'Shop',
  description: 'Browse the complete Louis Polo collection - trolley bags, sets, backpacks and more.',
}

export default function ShopPage() {
  return (
    <div className="pt-[4.5rem] md:pt-[4.5rem]">
      {/* Page header */}
      <div className="section-pad pb-0" style={{ paddingTop: '1rem' }}>
        <div className="container-lp">
          <span className="lp-eyebrow">Our collection</span>
          <div className="flex items-end justify-between gap-4">
            <h1 className="lp-heading-lg mb-2">All Products</h1>
            <div className="mb-3 shrink-0">
              <ShopSizeGuideButton />
            </div>
          </div>
          <p className="font-body text-[var(--color-lp-muted)] text-base mb-6">
            Built for every kind of traveller.
          </p>

          {/* Category tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
            {[
              {
                icon: (
                  <svg viewBox="0 0 32 40" fill="none" className="w-7 h-7" aria-hidden="true">
                    <rect x="3" y="8" width="26" height="28" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <rect x="11" y="2" width="10" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="16" y1="8" x2="16" y2="36" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2"/>
                    <line x1="3" y1="22" x2="29" y2="22" stroke="currentColor" strokeWidth="1"/>
                    <circle cx="8"  cy="37" r="2" fill="currentColor"/>
                    <circle cx="24" cy="37" r="2" fill="currentColor"/>
                  </svg>
                ),
                label: 'Trolley Bags',
                desc:  'Cabin to check-in. Hard-shell ABS built for airline abuse.',
              },
              {
                icon: (
                  <svg viewBox="0 0 40 28" fill="none" className="w-7 h-7" aria-hidden="true">
                    <path d="M4 8 C4 8 8 4 20 4 C32 4 36 8 36 8 L38 20 C38 23 36 24 34 24 L6 24 C4 24 2 23 2 20 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M14 4 C14 2 18 1 20 1 C22 1 26 2 26 4" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="2" y1="14" x2="38" y2="14" stroke="currentColor" strokeWidth="1"/>
                    <rect x="16" y="10" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                ),
                label: 'Duffle Bags',
                desc:  'Lightweight and roomy. Perfect for weekend getaways.',
              },
              {
                icon: (
                  <svg viewBox="0 0 30 36" fill="none" className="w-7 h-7" aria-hidden="true">
                    <path d="M10 6 C10 3 12 2 15 2 C18 2 20 3 20 6" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M6 6 L24 6 L26 30 C26 32 24 34 22 34 L8 34 C6 34 4 32 4 30 Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="4" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1"/>
                    <rect x="11" y="17" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1" fill="none"/>
                  </svg>
                ),
                label: 'Backpacks',
                desc:  'Daily commute or cabin travel. Organised and on your back.',
              },
              {
                icon: (
                  <svg viewBox="0 0 38 30" fill="none" className="w-7 h-7" aria-hidden="true">
                    <rect x="2" y="8" width="34" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <path d="M13 8 L13 5 C13 3.5 14.5 2 16 2 L22 2 C23.5 2 25 3.5 25 5 L25 8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                    <line x1="2" y1="16" x2="36" y2="16" stroke="currentColor" strokeWidth="1"/>
                    <line x1="19" y1="8"  x2="19" y2="28" stroke="currentColor" strokeWidth="1"/>
                  </svg>
                ),
                label: 'Office Bags',
                desc:  'Desk to departure gate. Structured, sharp, professional.',
              },
            ].map(({ icon, label, desc }) => (
              <div key={label} className="border-t-2 border-[var(--color-lp-gold)] pt-3 pr-2">
                <div className="text-[var(--color-lp-ink)] mb-2">{icon}</div>
                <p className="font-display text-[0.95rem] text-[var(--color-lp-ink)] mb-1">{label}</p>
                <p className="font-body text-[0.72rem] text-[var(--color-lp-muted)] leading-snug">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust + feature strip */}
      <div className="border-y border-lp-border bg-lp-cream">
        <div className="container-lp">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-2 py-3.5">
            {[
              { icon: '⭐', text: '2.47L sold · 4.8★' },
              { icon: '🚚', text: 'Free shipping' },
              { icon: '🛡️', text: '2-year warranty' },
              { icon: '🧳', text: 'ABS & Polycarbonate' },
              { icon: '🔒', text: 'TSA-approved lock' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <span className="text-sm">{icon}</span>
                <span className="font-body text-[0.65rem] tracking-[0.08em] uppercase text-lp-muted">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-pad pt-2">
        <div className="container-lp">
          {/* Suspense required: ProductGrid reads ?category= via useSearchParams */}
          <Suspense fallback={null}>
            <ProductGrid />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
