// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx
// Server Component — no interactivity needed.
// ─────────────────────────────────────────────────────────────────────────────

import Link                       from 'next/link'
import Image                      from 'next/image'
import { Instagram, Linkedin, Mail } from 'lucide-react'
import { BRAND, ROUTES }          from '@/lib/constants'

const SHOP_LINKS = [
  { label: 'All Products',    href: ROUTES.shop },
  { label: 'Trolley Bags',   href: `${ROUTES.shop}?category=trolley` },
  { label: 'Sets',            href: `${ROUTES.shop}?category=set` },
  { label: 'Backpacks',      href: `${ROUTES.shop}?category=backpack` },
  { label: 'Office Bags',    href: `${ROUTES.shop}?category=office-bag` },
  { label: 'Duffle Bags',    href: `${ROUTES.shop}?category=duffle` },
  { label: 'Vanity Cases',   href: `${ROUTES.shop}?category=vanity` },
]

const COMPANY_LINKS = [
  { label: 'About Us',        href: ROUTES.about },
  { label: 'Contact',         href: ROUTES.contact },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',  href: '/store/privacy' },
  { label: 'Refund Policy',   href: '/store/refund-policy' },
  { label: 'Terms of Use',    href: '/store/terms' },
]

export function Footer() {
  return (
    <footer className="bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] mt-0 pt-10 md:pt-14">
      <div className="container-lp py-14 md:py-16">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Image
              src="/logo.svg"
              alt="Louis Polo"
              width={78}
              height={52}
              className="mb-4 brightness-0 invert"
            />
            <p className="font-body text-[0.8rem] text-white/45 leading-relaxed mb-6">
              Premium hard luggage, designed for every journey.<br />
              10+ years of manufacturing excellence.
            </p>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-200 hover:opacity-80"
                aria-label="Instagram"
                style={{ color: '#E1306C' }}
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-200 hover:opacity-80"
                aria-label="LinkedIn"
                style={{ color: '#0A66C2' }}
              >
                <Linkedin size={17} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity duration-200 hover:opacity-80"
                aria-label="WhatsApp"
                style={{ color: '#25D366' }}
              >
                <svg width={17} height={17} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.529 5.845L.057 23.48a.75.75 0 0 0 .923.923l5.635-1.472A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.209-1.432l-.374-.22-3.88 1.013 1.013-3.88-.22-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
              </a>
              <a
                href="mailto:support@louispolo.in"
                className="transition-opacity duration-200 hover:opacity-80"
                aria-label="Email support"
                style={{ color: '#6B7280' }}
              >
                <Mail size={17} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Shop links */}
          <div>
            <p className="lp-eyebrow mb-4 text-white/30">Shop</p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[0.8rem] text-white/50 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <p className="lp-eyebrow mb-4 text-white/30">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[0.8rem] text-white/50 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal + contact */}
          <div>
            <p className="lp-eyebrow mb-4 text-white/30">Support</p>
            <ul className="space-y-2.5 mb-6">
              {LEGAL_LINKS.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="font-body text-[0.8rem] text-white/50 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="font-body text-[0.75rem] text-white/35 leading-relaxed">
              {BRAND.email}<br />{BRAND.phone}
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="font-body text-[0.7rem] text-white/25 tracking-wide">
            © {new Date().getFullYear()} LOUISPOLO FASHION INDIA PRIVATE LIMITED.
            All rights reserved.
          </p>
          <div className="flex w-full justify-between font-body text-[0.7rem] text-white/20 tracking-wide">
            <span>Mumbai</span>
            <span>London</span>
            <span>Hong Kong</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
