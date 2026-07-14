'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/Navbar.tsx
// Sticky navbar with:
// - Scroll progress bar (gold line at bottom)
// - Transparent on hero, opaque + backdrop-blur on scroll
// - Centred logo
// - Desktop nav links left, cart + whatsapp right
// - No dark mode
// ─────────────────────────────────────────────────────────────────────────────

import Link                  from 'next/link'
import Image                 from 'next/image'
import { usePathname }       from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { ShoppingBag, Menu, X, Search, Heart, User } from 'lucide-react'
import { NAV_ITEMS, ROUTES, BRAND }    from '@/lib/constants'
import { cn }                          from '@/lib/utils'
import { SearchOverlay }               from '@/components/search/SearchOverlay'
import { CorporateEnquiryModal }       from '@/components/ui/CorporateEnquiryModal'

// ─── Hook: wishlist count ─────────────────────────────────────────────────────
function useWishlistCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    import('@/store/wishlistStore').then(({ useWishlistStore }) => {
      const unsub = useWishlistStore.subscribe((state) => setCount(state.ids.length))
      setCount(useWishlistStore.getState().ids.length)
      return unsub
    })
  }, [])
  return count
}

// ─── Hook: cart item count ────────────────────────────────────────────────────
// Lazy import to avoid SSR mismatch with Zustand localStorage
function useCartCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    // Dynamic import so Zustand runs client-side only
    import('@/store/cartStore').then(({ useCartStore }) => {
      const unsub = useCartStore.subscribe((state) => {
        const total = state.items.reduce((s, i) => s + i.quantity, 0)
        setCount(total)
      })
      const total = useCartStore.getState().items.reduce((s, i) => s + i.quantity, 0)
      setCount(total)
      return unsub
    })
  }, [])
  return count
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname      = usePathname()
  const cartCount     = useCartCount()
  const wishlistCount = useWishlistCount()
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [corpOpen,     setCorpOpen]     = useState(false)

  // Scroll progress bar
  const { scrollYProgress } = useScroll({
    offset: ['start start', 'end end'],
  })
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping:   30,
    restDelta: 0.001,
  })

  // Fix Android Chrome dynamic toolbar
  useEffect(() => {
    const metaViewport = document.querySelector('meta[name=viewport]')
    if (metaViewport) {
      metaViewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, viewport-fit=cover, interactive-widget=resizes-content'
      )
    }
  }, [])

  // CMD+K / Ctrl+K to open search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when mobile menu is open (html + body for iOS Safari)
  // Also toggle a class used to hide the WhatsApp button behind the menu
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
      document.body.classList.add('menu-open')
    } else {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  return (
    <>
      <header
        className={cn(
          'fixed top-1 left-1/2 -translate-x-1/2 z-50 transition-all duration-500',
          'bg-lp-porcelain/95 backdrop-blur-md',
          'border border-lp-border',
          'rounded-full shadow-lg shadow-black/8',
          'w-[calc(100%-2rem)] max-w-5xl overflow-hidden',
        )}
        style={{ isolation: 'isolate' }}
      >
        {/* ── Scroll progress bar (clips to pill shape via overflow-hidden) ── */}
        {!pathname.startsWith('/account') && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-lp-ink/45"
            style={{ scaleX }}
            transformTemplate={({ scaleX }) =>
              `scaleX(${scaleX ?? 1})`
            }
          />
        )}

        <div className="px-5 md:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">

            {/* ── Left: Hamburger (mobile) / Nav links (desktop) ─────────── */}
            <div className="flex items-center gap-8 flex-1">

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="lg:hidden -m-2 p-2 text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>

              {/* Desktop nav links — left of logo (Home, Shop, About) */}
              <nav className="hidden lg:flex items-center gap-8">
                {NAV_ITEMS.filter(({ label }) => label !== 'Contact').map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'relative font-body text-[0.75rem] tracking-[0.12em] uppercase transition-colors duration-200',
                      'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-lp-ink/45',
                      'after:transition-all after:duration-300',
                      pathname === href
                        ? 'text-lp-ink after:w-full'
                        : 'text-[var(--color-lp-ink)] hover:text-lp-ink/45 after:w-0 hover:after:w-full'
                    )}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* ── Centre: Logo ────────────────────────────────────────────── */}
            <Link
              href={ROUTES.home}
              className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
              aria-label="Louis Polo home"
            >
              
              <Image
                    src="/logo.svg"
                    alt="Louis Polo"
                    width={100}
                    height={97}
                    className="h-12 w-auto object-contain"
                    priority
                  />
            </Link>

            {/* ── Right: Contact + Corporate Enquiry + icons ────────────── */}
            <div className="flex items-center gap-4 flex-1 justify-end">

              {/* Corporate Enquiry — desktop only */}
              <button
                onClick={() => setCorpOpen(true)}
                className="hidden lg:block relative font-body text-[0.75rem] tracking-[0.12em] uppercase transition-colors duration-200 text-[var(--color-lp-ink)] hover:text-lp-ink/45"
              >
                B2B Corporate Enquiry
              </button>

              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="-m-2 p-2 text-lp-ink hover:text-lp-gold transition-colors duration-200"
                aria-label="Search products (⌘K)"
              >
                <Search size={20} strokeWidth={1.5} />
              </button>

              {/* Account — desktop only */}
              <Link
                href="/account"
                className="hidden lg:block -m-2 p-2 text-lp-ink hover:text-lp-gold transition-colors duration-200"
                aria-label="My Account"
              >
                <User size={20} strokeWidth={1.5} />
              </Link>

              {/* Wishlist */}
              <Link
                href={ROUTES.wishlist}
                className="relative -m-2 p-2 text-lp-ink hover:text-lp-gold transition-colors duration-200"
                aria-label={`Wishlist, ${wishlistCount} items`}
              >
                <Heart size={20} strokeWidth={1.5} />
                {wishlistCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-[#C0392B] text-lp-porcelain text-[9px] font-semibold flex items-center justify-center tabular-nums"
                  >
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </motion.span>
                )}
              </Link>

              {/* Cart — desktop only */}
              <Link
                href={ROUTES.cart}
                className="relative hidden lg:block -m-2 p-2 text-lp-ink hover:text-lp-gold transition-colors duration-200"
                aria-label={`Cart, ${cartCount} items`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute top-0 right-0 w-4.5 h-4.5 rounded-full bg-lp-ink text-lp-porcelain text-[9px] font-semibold flex items-center justify-center tabular-nums"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </Link>
            </div>

          </div>
        </div>
      </header>

      {/* ── Mobile menu ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-[var(--color-lp-porcelain)] flex flex-col pt-16"
          >
            {/* Nav links */}
            <nav className="flex-1 flex flex-col justify-start pt-8 px-8 gap-1">
              {NAV_ITEMS.map(({ label, href }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-4 border-b border-[var(--color-lp-border)]"
                  >
                    <span className="font-display text-[1.5rem] text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors duration-200">
                      {label}
                    </span>
                  </Link>
                </motion.div>
              ))}

              {/* Corporate Enquiry */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: 0.08 + NAV_ITEMS.length * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <button
                  onClick={() => { setMenuOpen(false); setCorpOpen(true) }}
                  className="block w-full text-left py-4 border-b border-[var(--color-lp-border)]"
                >
                  <span className="font-display text-[1.5rem] text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors duration-200">
                    B2B Corporate Enquiry
                  </span>
                </button>
              </motion.div>
            </nav>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="px-8 pb-24 space-y-3"
            >
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full justify-center"
                style={{ backgroundColor: '#D2CFC8', borderColor: '#D2CFC8', color: 'var(--color-lp-ink)' }}
                onClick={() => setMenuOpen(false)}
              >
                <svg width={16} height={16} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.558 4.118 1.529 5.845L.057 23.48a.75.75 0 0 0 .923.923l5.635-1.472A11.942 11.942 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.686-.523-5.209-1.432l-.374-.22-3.88 1.013 1.013-3.88-.22-.374A9.956 9.956 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Chat with us
              </a>
              <p className="text-center font-body text-[0.7rem] tracking-[0.1em] text-lp-faint break-all">
                {BRAND.email} · {BRAND.phone}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CorporateEnquiryModal open={corpOpen} onClose={() => setCorpOpen(false)} />
    </>
  )
}
