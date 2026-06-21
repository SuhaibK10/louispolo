import { redirect }       from 'next/navigation'
import { createClient }   from '@/lib/supabase/server'
import { logout }         from '@/app/account/actions'
import Link              from 'next/link'
import { ROUTES }        from '@/lib/constants'
import { ShoppingBag, Heart, LogOut, User } from 'lucide-react'

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/account/login')

  const name  = user.user_metadata?.full_name ?? user.user_metadata?.name ?? null
  const email = user.email ?? ''
  const initials = name
    ? name.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
    : email[0]?.toUpperCase() ?? 'U'

  return (
    <div className="pt-16 md:pt-[4.5rem] min-h-screen">
      <div className="container-lp section-pad max-w-[38rem]">

        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--color-lp-ink)', color: 'var(--color-lp-porcelain)' }}
          >
            <span className="font-display text-[1.2rem]">{initials}</span>
          </div>
          <div>
            {name && (
              <p className="font-display text-[1.4rem] text-[var(--color-lp-ink)] leading-tight">{name}</p>
            )}
            <p className="font-body text-[0.8rem] text-[var(--color-lp-muted)]">{email}</p>
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link
            href={ROUTES.shop}
            className="flex items-center gap-3 p-4 border border-[var(--color-lp-border)] hover:border-[var(--color-lp-gold)] transition-colors duration-200 group"
          >
            <ShoppingBag size={18} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
            <div>
              <p className="font-body text-[0.8rem] font-medium text-[var(--color-lp-ink)]">Shop</p>
              <p className="font-body text-[0.65rem] text-[var(--color-lp-muted)]">Browse collection</p>
            </div>
          </Link>

          <Link
            href={ROUTES.wishlist}
            className="flex items-center gap-3 p-4 border border-[var(--color-lp-border)] hover:border-[var(--color-lp-gold)] transition-colors duration-200 group"
          >
            <Heart size={18} strokeWidth={1.5} className="text-[var(--color-lp-gold)]" />
            <div>
              <p className="font-body text-[0.8rem] font-medium text-[var(--color-lp-ink)]">Wishlist</p>
              <p className="font-body text-[0.65rem] text-[var(--color-lp-muted)]">Saved items</p>
            </div>
          </Link>
        </div>

        {/* Account details */}
        <div className="border border-[var(--color-lp-border)] mb-6">
          <div className="px-5 py-4 border-b border-[var(--color-lp-border)]">
            <div className="flex items-center gap-2">
              <User size={14} strokeWidth={1.5} className="text-[var(--color-lp-muted)]" />
              <p className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-[var(--color-lp-muted)]">Account details</p>
            </div>
          </div>
          <div className="divide-y divide-[var(--color-lp-border)]">
            {name && (
              <div className="px-5 py-3.5 flex justify-between">
                <span className="font-body text-[0.75rem] text-[var(--color-lp-muted)]">Name</span>
                <span className="font-body text-[0.8rem] text-[var(--color-lp-ink)]">{name}</span>
              </div>
            )}
            <div className="px-5 py-3.5 flex justify-between">
              <span className="font-body text-[0.75rem] text-[var(--color-lp-muted)]">Email</span>
              <span className="font-body text-[0.8rem] text-[var(--color-lp-ink)]">{email}</span>
            </div>
            <div className="px-5 py-3.5 flex justify-between">
              <span className="font-body text-[0.75rem] text-[var(--color-lp-muted)]">Sign-in method</span>
              <span className="font-body text-[0.8rem] text-[var(--color-lp-ink)] capitalize">
                {user.app_metadata?.provider ?? 'email'}
              </span>
            </div>
          </div>
        </div>

        {/* Orders placeholder */}
        <div className="border border-[var(--color-lp-border)] mb-8">
          <div className="px-5 py-4 border-b border-[var(--color-lp-border)]">
            <div className="flex items-center gap-2">
              <ShoppingBag size={14} strokeWidth={1.5} className="text-[var(--color-lp-muted)]" />
              <p className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-[var(--color-lp-muted)]">Orders</p>
            </div>
          </div>
          <div className="px-5 py-8 text-center">
            <p className="font-body text-[0.85rem] text-[var(--color-lp-muted)]">No orders yet.</p>
            <Link
              href={ROUTES.shop}
              className="inline-block mt-3 font-body text-[0.75rem] tracking-[0.08em] uppercase text-[var(--color-lp-gold)] hover:underline"
            >
              Start shopping →
            </Link>
          </div>
        </div>

        {/* Sign out */}
        <form action={logout}>
          <button
            type="submit"
            className="flex items-center gap-2 font-body text-[0.75rem] tracking-[0.08em] uppercase text-[var(--color-lp-muted)] hover:text-[var(--color-lp-error)] transition-colors duration-200"
          >
            <LogOut size={14} strokeWidth={1.5} />
            Sign out
          </button>
        </form>

      </div>
    </div>
  )
}
