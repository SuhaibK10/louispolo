// ─────────────────────────────────────────────────────────────────────────────
// app/store/shop/page.tsx
// Shop page — server component. ProductGrid is client for filtering.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }  from 'next'
import { ProductGrid }    from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title:       'Shop',
  description: 'Browse the complete Louis Polo collection - trolley bags, sets, backpacks and more.',
}

export default function ShopPage() {
  return (
    <div className="pt-[4.5rem] md:pt-[4.5rem]">
      {/* Page header */}
      <div className="section-pad pb-0" style={{ paddingTop: '2rem' }}>
        <div className="container-lp">
          <span className="lp-eyebrow">Our collection</span>
          <h1 className="lp-heading-lg mb-2">All Products</h1>
          <p className="font-body text-[var(--color-lp-muted)] text-base mb-0">
            Hard-shell luggage built to outlast your most ambitious trips.
          </p>
        </div>
      </div>

      {/* Trust + feature strip */}
      <div className="border-y border-lp-border bg-lp-cream">
        <div className="container-lp">
          <div className="flex flex-wrap items-center justify-center md:justify-between gap-x-6 gap-y-2 py-3.5">
            {[
              { icon: '🚚', text: 'Free shipping' },
              { icon: '🛡️', text: '2-year warranty' },
              { icon: '🧳', text: 'ABS & Polycarbonate' },
              { icon: '⚙️', text: 'Spinner wheels' },
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

      <div className="section-pad pt-8">
        <div className="container-lp">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
