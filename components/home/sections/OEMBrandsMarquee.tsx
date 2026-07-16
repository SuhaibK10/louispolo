// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/OEMBrandsMarquee.tsx
// Infinite moving strip of OEM client brands. Rendered inside the light
// CorporateSection: logos flattened to ink silhouettes via brightness-0.
// Brands come from config/oemBrands.ts: logo image when a Cloudinary
// publicId is set, text wordmark otherwise.
// The track is duplicated once and shifted -50% by .animate-marquee.
// ─────────────────────────────────────────────────────────────────────────────

import Image           from 'next/image'
import { OEM_BRANDS }   from '@/config/oemBrands'
import { cld }          from '@/lib/cloudinary'

function BrandItem({ name, publicId }: { name: string; publicId: string }) {
  return (
    <div className="flex items-center flex-shrink-0 px-7 md:px-10">
      {publicId ? (
        <Image
          src={cld(publicId, 'f_auto,q_auto,h_64,c_limit')}
          alt={name}
          width={120}
          height={32}
          draggable="false"
          className="h-6 md:h-7 w-auto object-contain opacity-60 brightness-0 select-none"
        />
      ) : (
        <span className="font-display text-[0.95rem] md:text-[1.05rem] tracking-[0.08em] uppercase text-[var(--color-lp-muted)] whitespace-nowrap select-none">
          {name}
        </span>
      )}
    </div>
  )
}

export function OEMBrandsMarquee() {
  if (OEM_BRANDS.length === 0) return null

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage:       'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}
    >
      <div className="animate-marquee w-max" style={{ animationDuration: '48s' }}>
        {[0, 1].map(copy => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {OEM_BRANDS.map(brand => (
              <BrandItem key={`${copy}-${brand.name}`} {...brand} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
