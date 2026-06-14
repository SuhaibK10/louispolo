// ─────────────────────────────────────────────────────────────────────────────
// components/home/HomeEditorial.tsx
// Homepage orchestrator — imports sections, no logic here.
// Add, remove, or reorder sections by editing this file only.
// ─────────────────────────────────────────────────────────────────────────────

import { HeroSection }         from './sections/HeroSection'
import { TrustBar }            from './sections/TrustBar'
import { BestSellersCarousel } from './sections/BestSellersCarousel'
import { CategoryGrid }        from './sections/CategoryGrid'
import { ReviewsSection }      from './sections/ReviewsSection'
import { BrandStory }          from './sections/BrandStory'

export function HomeEditorial() {
  return (
    <main>
      <HeroSection />
      <TrustBar />
      <BestSellersCarousel />
      <CategoryGrid />
      <ReviewsSection />
      <BrandStory />
    </main>
  )
}
