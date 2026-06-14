'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/layout/MobileNav.tsx
// Bottom navigation bar — mobile only. Home, Shop, Cart, Account.
// Cart badge shows live item count from Zustand.
// ─────────────────────────────────────────────────────────────────────────────

import Link                          from 'next/link'
import { usePathname }               from 'next/navigation'
import { useState, useEffect }       from 'react'
import { Home, ShoppingBag, User, Grid2x2 } from 'lucide-react'
import { cn }                        from '@/lib/utils'
import { ROUTES }                    from '@/lib/constants'

const NAV = [
  { label: 'Home',    href: ROUTES.home,    icon: Home       },
  { label: 'Shop',    href: ROUTES.shop,    icon: Grid2x2    },
  { label: 'Cart',    href: ROUTES.cart,    icon: ShoppingBag },
  { label: 'Account', href: '/account',     icon: User       },
] as const

function useCartCount() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    import('@/store/cartStore').then(({ useCartStore }) => {
      const update = () => {
        const total = useCartStore.getState().items.reduce((s, i) => s + i.quantity, 0)
        setCount(total)
      }
      update()
      return useCartStore.subscribe(update)
    })
  }, [])
  return count
}

export function MobileNav() {
  const pathname  = usePathname()
  const cartCount = useCartCount()

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-lp-porcelain)]/95 backdrop-blur-md border-t border-[var(--color-lp-border)] pb-safe">
      <div className="flex items-center">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = href === ROUTES.home
            ? pathname === href
            : pathname.startsWith(href)
          const isCart = href === ROUTES.cart

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex-1 flex flex-col items-center justify-center gap-1 py-3 transition-colors duration-200',
                isActive
                  ? 'text-[var(--color-lp-gold)]'
                  : 'text-[var(--color-lp-faint)] hover:text-[var(--color-lp-muted)]'
              )}
              aria-label={label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="relative">
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                {isCart && cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-[16px] h-[16px] rounded-full bg-[var(--color-lp-gold)] text-[var(--color-lp-ink)] text-[8px] font-bold flex items-center justify-center tabular-nums">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </div>
              <span className="font-body text-[0.55rem] tracking-[0.1em] uppercase">
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
