// ─────────────────────────────────────────────────────────────────────────────
// app/store/about/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }  from 'next'
import { BrandStory }     from '@/components/home/sections/BrandStory'

export const metadata: Metadata = {
  title:       'About Us',
  description: '9 years of OEM manufacturing excellence. Louis Polo — premium hard luggage, now direct to you.',
}

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="section-pad pb-0">
        <div className="container-lp">
          <span className="lp-eyebrow">Our Story</span>
          <h1 className="lp-heading-lg mb-2">
            9 years building for the world&apos;s biggest brands.
          </h1>
        </div>
      </div>

      <BrandStory />
    </div>
  )
}
