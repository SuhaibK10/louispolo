// ─────────────────────────────────────────────────────────────────────────────
// components/layout/FooterCorporateLink.tsx
// "Corporate Enquiry" footer link — links to the Corporate Gifting page.
// Styled to match the other footer links.
// ─────────────────────────────────────────────────────────────────────────────

import Link       from 'next/link'
import { ROUTES } from '@/lib/constants'

export function FooterCorporateLink() {
  return (
    <Link
      href={ROUTES.corporateGifting}
      className="font-body text-[0.8rem] text-white/65 hover:text-lp-gold transition-colors duration-200"
    >
      Corporate Gifting
    </Link>
  )
}
