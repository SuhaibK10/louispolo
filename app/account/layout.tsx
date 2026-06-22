import { Navbar }          from '@/components/layout/Navbar'
import { MobileNav }       from '@/components/layout/MobileNav'
import { WhatsAppButton }  from '@/components/ui/WhatsappButton'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
      <MobileNav />
      <WhatsAppButton />
      <div className="mobile-nav-spacer lg:hidden" aria-hidden="true" />
    </>
  )
}
