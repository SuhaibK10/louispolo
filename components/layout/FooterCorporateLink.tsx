'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/FooterCorporateLink.tsx
// "Corporate Enquiry" footer link — client island that opens the existing
// CorporateEnquiryModal. Styled to match the other footer links.
// ─────────────────────────────────────────────────────────────────────────────

import { useState }              from 'react'
import { CorporateEnquiryModal } from '@/components/ui/CorporateEnquiryModal'

export function FooterCorporateLink() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="font-body text-[0.8rem] text-white/50 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
      >
        B2B Corporate Enquiry
      </button>
      <CorporateEnquiryModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
