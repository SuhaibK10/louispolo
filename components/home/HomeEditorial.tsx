// ─────────────────────────────────────────────────────────────────────────────
// components/home/HomeEditorial.tsx
// Homepage orchestrator — imports sections, no logic here.
// Add, remove, or reorder sections by editing this file only.
// ─────────────────────────────────────────────────────────────────────────────

import { HeroSection }         from './sections/HeroSection'
import { ExpoPromoModal }      from './sections/ExpoPromoModal'
import { ScrollHint }          from './sections/ScrollHint'
import { BestSellersCarousel } from './sections/BestSellersCarousel'
import { PromoBanner }         from './sections/PromoBanner'
import { IndependenceDayBanner } from './sections/IndependenceDayBanner'
import { CategoryGrid }        from './sections/CategoryGrid'
import { ProductSpotlight }    from './sections/ProductSpotlight'
import { ReviewsSection }      from './sections/ReviewsSection'
import { ExhibitionGallery }   from './sections/ExhibitionGallery'
import { EXHIBITION_GALLERY_HOME_ENABLED } from '@/config/exhibitions'
import { ScrollShowcase }      from './sections/ScrollShowcase'
import { VERTEX_SHOWCASE_HOME_ENABLED, VERTEX_SHOWCASE_HEADER, VERTEX_SHOWCASE_STOPS } from '@/config/vertexShowcase'
import { ShopByColorPrice }    from './sections/ShopByColorPrice'
import { SHOP_BY_COLOR_PRICE_HOME_ENABLED } from '@/config/shopByColorPrice'
import { CommunityShowcase }   from './sections/CommunityShowcase'
import { COMMUNITY_SHOWCASE_HOME_ENABLED } from '@/config/communityShowcase'

const INDEPENDENCE_DAY_BANNER_ENABLED = false

export function HomeEditorial() {
  return (
    <main>
      <HeroSection />
      <ExpoPromoModal />
      <ScrollHint />
      {VERTEX_SHOWCASE_HOME_ENABLED && (
        <ScrollShowcase
          eyebrow={VERTEX_SHOWCASE_HEADER.eyebrow}
          heading={VERTEX_SHOWCASE_HEADER.heading}
          stops={VERTEX_SHOWCASE_STOPS}
        />
      )}
      {INDEPENDENCE_DAY_BANNER_ENABLED && <IndependenceDayBanner />}
      <CategoryGrid />
      {/* Temporarily disabled — "First-Time Buyers" promo turned off. */}
      {false && <PromoBanner />}
      <BestSellersCarousel />
      {COMMUNITY_SHOWCASE_HOME_ENABLED && <CommunityShowcase />}
      {SHOP_BY_COLOR_PRICE_HOME_ENABLED && <ShopByColorPrice />}
      {/* Temporarily disabled — "See it the way you will use it" spotlight turned off. */}
      {false && <ProductSpotlight />}
      {EXHIBITION_GALLERY_HOME_ENABLED && <ExhibitionGallery />}
      <ReviewsSection />
    </main>
  )
}
