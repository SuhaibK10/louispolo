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
import { ShoppingBag, Menu, X, MessageCircle } from 'lucide-react'
import { NAV_ITEMS, ROUTES, BRAND }  from '@/lib/constants'
import { cn }                from '@/lib/utils'

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
  const pathname  = usePathname()
  const cartCount = useCartCount()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  // Scroll progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping:   30,
    restDelta: 0.001,
  })

  // Detect scroll for nav style change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [pathname])

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const isHero = pathname === '/'

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled || menuOpen || !isHero
            ? 'bg-[var(--color-lp-porcelain)]/95 backdrop-blur-md border-b border-[var(--color-lp-border)]'
            : 'bg-transparent'
        )}
      >
        {/* ── Scroll progress bar ────────────────────────────────────────── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left bg-[var(--color-lp-gold)]"
          style={{ scaleX }}
        />

        <div className="container-lp">
          <div className="flex items-center justify-between h-16 md:h-[4.5rem]">

            {/* ── Left: Hamburger (mobile) / Nav links (desktop) ─────────── */}
            <div className="flex items-center gap-8 flex-1">

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="md:hidden text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              >
                {menuOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>

              {/* Desktop nav links */}
              <nav className="hidden md:flex items-center gap-8">
                {NAV_ITEMS.map(({ label, href }) => (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      'relative font-body text-[0.75rem] tracking-[0.12em] uppercase transition-colors duration-200',
                      'after:absolute after:bottom-[-3px] after:left-0 after:h-[1.5px] after:bg-[var(--color-lp-gold)]',
                      'after:transition-all after:duration-300',
                      pathname === href
                        ? 'text-[var(--color-lp-gold)] after:w-full'
                        : 'text-[var(--color-lp-muted)] hover:text-[var(--color-lp-ink)] after:w-0 hover:after:w-full'
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
              aria-label="Louis Polo — Home"
            >
              {/* Text logo — elegant, editorial */}
              <span className="font-display text-[1.35rem] tracking-[0.06em] text-[var(--color-lp-ink)] select-none leading-none">
                Louis Poloo
              </span>
            </Link>

            {/* ── Right: WhatsApp + Cart ──────────────────────────────────── */}
            <div className="flex items-center gap-4 flex-1 justify-end">

              {/* WhatsApp — desktop only */}
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:flex items-center gap-1.5 text-[var(--color-lp-muted)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-label="Chat on WhatsApp"
              >
                <MessageCircle size={18} strokeWidth={1.5} />
                <span className="font-body text-[0.7rem] tracking-[0.1em] uppercase">
                  Chat
                </span>
              </a>

              {/* Cart */}
              <Link
                href={ROUTES.cart}
                className="relative text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors duration-200"
                aria-label={`Cart — ${cartCount} items`}
              >
                <ShoppingBag size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                    className="absolute -top-1.5 -right-1.5 w-[18px] h-[18px] rounded-full bg-[var(--color-lp-gold)] text-[var(--color-lp-ink)] text-[9px] font-semibold flex items-center justify-center tabular-nums"
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
            <nav className="flex-1 flex flex-col justify-center px-8 gap-1">
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
                    <span className="font-display text-[2.25rem] text-[var(--color-lp-ink)] hover:text-[var(--color-lp-gold)] transition-colors duration-200">
                      {label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Bottom CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: 0.3, duration: 0.4 }}
              className="px-8 pb-12 space-y-3"
            >
              <a
                href={BRAND.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full justify-center"
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle size={16} strokeWidth={1.5} />
                Chat with us
              </a>
              <p className="text-center font-body text-[0.7rem] tracking-[0.1em] uppercase text-[var(--color-lp-faint)]">
                {BRAND.email} · {BRAND.phone}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
