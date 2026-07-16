'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/ui/MyntraBuyButton.tsx
// Buy CTA for products stocked on Myntra. Opens the listing in a new tab
// (deep-links into the Myntra app on phones) and fires a Vercel Analytics
// event so we can measure clicks per product and placement.
// ─────────────────────────────────────────────────────────────────────────────

import Image             from 'next/image'
import { track }        from '@vercel/analytics'
import { ExternalLink } from 'lucide-react'

interface Props {
  url: string
  slug: string
  size?: string | null
  placement: 'card' | 'pdp'
  className?: string
}

export function MyntraBuyButton({ url, slug, size, placement, className }: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.stopPropagation()
        track('myntra_click', { slug, size: size ?? 'default', placement })
      }}
      className={`${className ?? 'btn-primary flex-1 justify-center'} group/myntra`}
    >
      <Image
        src="/myntra-m.png"
        alt=""
        width={15}
        height={12}
        className="brightness-0 invert transition-[filter] duration-200 group-hover/myntra:invert-0"
      />
      Buy on Myntra
      <ExternalLink size={14} strokeWidth={1.5} />
    </a>
  )
}
