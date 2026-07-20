// ─────────────────────────────────────────────────────────────────────────────
// components/home/HomeEditorial.tsx
// Homepage orchestrator — imports sections, no logic here.
// Add, remove, or reorder sections by editing this file only.
// ─────────────────────────────────────────────────────────────────────────────

import { HeroSection }         from './sections/HeroSection'
import { BestSellersCarousel } from './sections/BestSellersCarousel'
import { PromoBanner }         from './sections/PromoBanner'
import { CategoryGrid }        from './sections/CategoryGrid'
import { ProductSpotlight }    from './sections/ProductSpotlight'
import { ReviewsSection }      from './sections/ReviewsSection'
import { ExhibitionGallery }   from './sections/ExhibitionGallery'

export function HomeEditorial() {
  return (
    <main>
      <HeroSection />
      <CategoryGrid />
      <BestSellersCarousel />
      <PromoBanner />
      <ProductSpotlight />
      <ExhibitionGallery />
      <ReviewsSection />
    </main>
  )
}
