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
      <div className="h-[56px] md:hidden" aria-hidden="true" />
    </>
  )
}
