// ─────────────────────────────────────────────────────────────────────────────
// app/store/about/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }       from 'next'
import { BrandStory }          from '@/components/home/sections/BrandStory'
import { FactoryGallery }      from '@/components/about/FactoryGallery'
import { FactoryStats }        from '@/components/about/FactoryStats'
import { ExhibitionGallery }   from '@/components/home/sections/ExhibitionGallery'

export const metadata: Metadata = {
  title:       'About Us',
  description: '10+ years of OEM manufacturing excellence. Louis Polo: premium hard luggage, now direct to you.',
}

export default function AboutPage() {
  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <FactoryGallery />
      <FactoryStats />
      <BrandStory />
      <ExhibitionGallery />
    </div>
  )
}
