// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Footer.tsx
// Server Component — no interactivity needed.
// ─────────────────────────────────────────────────────────────────────────────

import Link                       from 'next/link'
import { Instagram, Linkedin, MessageCircle } from 'lucide-react'
import { BRAND, ROUTES }          from '@/lib/constants'

const SHOP_LINKS = [
  { label: 'All Products',    href: ROUTES.shop },
  { label: 'Trolley Bags',   href: `${ROUTES.shop}?category=trolley` },
  { label: 'Sets',            href: `${ROUTES.shop}?category=set` },
  { label: 'Backpacks',      href: `${ROUTES.shop}?category=backpack` },
  { label: 'Office Bags',    href: `${ROUTES.shop}?category=office-bag` },
]

const COMPANY_LINKS = [
  { label: 'About Us',        href: ROUTES.about },
  { label: 'Contact',         href: ROUTES.contact },
  { label: 'Track Order',     href: '/orders' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy',  href: '/privacy' },
  { label: 'Refund Policy',   href: '/refund-policy' },
  { label: 'Terms of Use',    href: '/terms' },
]

export function Footer() {
  return (
    <footer className="bg-[var(--color-lp-ink)] text-[var(--color-lp-porcelain)] mt-0">
      <div className="container-lp py-14 md:py-16">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-xl tracking-[0.04em] block mb-4">
              Louis Polo
            </span>
            <p className="font-body text-[0.8rem] text-white/45 leading-relaxed mb-6">
              Premium hard luggage, designed for every journey.<br />
              9 years of manufacturing excellence.
            </p>

            {/* Social */}
            <div className="flex gap-4">
              <a
                href={BRAND.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={17} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-label="LinkedIn"
              >
                <Linkedin size={17} strokeWidth={1.5} />
              </a>
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <MessageCircle size={17} strokeWidth={1.5} />
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
          <p className="font-body text-[0.7rem] text-white/20 tracking-wide">
            Mumbai · Bhiwandi · London · Hong Kong
          </p>
        </div>
      </div>
    </footer>
  )
}
