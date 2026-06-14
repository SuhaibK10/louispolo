// ─────────────────────────────────────────────────────────────────────────────
// app/store/layout.tsx
// All store pages share this layout — Navbar + Footer + MobileNav.
// ─────────────────────────────────────────────────────────────────────────────

import { Navbar }    from '@/components/layout/Navbar'
import { Footer }    from '@/components/layout/Footer'
import { MobileNav } from '@/components/layout/MobileNav'

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
      {/* Mobile bottom nav — hidden on md+ via CSS */}
      <MobileNav />
      {/* Spacer so content isn't hidden behind mobile nav */}
      <div className="h-[64px] md:hidden" aria-hidden="true" />
    </>
  )
}
