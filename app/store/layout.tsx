// ─────────────────────────────────────────────────────────────────────────────
// app/store/layout.tsx
// All store pages share this layout — Navbar + Footer + MobileNav.
// ─────────────────────────────────────────────────────────────────────────────

import { Navbar }          from '@/components/layout/Navbar'
import { Footer }          from '@/components/layout/Footer'
import { MobileNav }       from '@/components/layout/MobileNav'
import { WhatsAppButton }  from '@/components/ui/WhatsappButton'
import { PageTransition }  from '@/components/layout/PageTransition'


export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>

      <Navbar />
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
      {/* Mobile bottom nav — hidden on md+ via CSS */}
      <MobileNav />
      {/* Spacer so content isn't hidden behind mobile nav — matches nav height + safe area */}
      <WhatsAppButton />
      <div className="mobile-nav-spacer lg:hidden" aria-hidden="true" />
    </>
  )
}
