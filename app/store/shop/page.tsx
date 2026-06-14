// ─────────────────────────────────────────────────────────────────────────────
// app/store/shop/page.tsx
// Shop page — server component. ProductGrid is client for filtering.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }  from 'next'
import { ProductGrid }    from '@/components/shop/ProductGrid'

export const metadata: Metadata = {
  title:       'Shop',
  description: 'Browse the complete Louis Polo collection — trolley bags, sets, backpacks and more.',
}

export default function ShopPage() {
  return (
    <div className="pt-[4.5rem] md:pt-[4.5rem]">
      {/* Page header */}
      <div className="section-pad pb-0">
        <div className="container-lp">
          <span className="lp-eyebrow">Our collection</span>
          <h1 className="lp-heading-lg mb-2">All Products</h1>
          <p className="font-body text-[var(--color-lp-muted)] text-base mb-10">
            Hard-shell luggage built to outlast your most ambitious trips.
          </p>
        </div>
      </div>

      <div className="section-pad pt-0">
        <div className="container-lp">
          <ProductGrid />
        </div>
      </div>
    </div>
  )
}
