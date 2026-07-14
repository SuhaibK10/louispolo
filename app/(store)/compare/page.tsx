// ─────────────────────────────────────────────────────────────────────────────
// app/(store)/compare/page.tsx
// Product comparison page. Deep-linkable: /store/compare?p=slug,slug,slug
// pre-fills the columns (missing slots fall back to defaults).
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }        from 'next'
import { ComparePageClient }    from '@/components/compare/ComparePageClient'

export const metadata: Metadata = {
  title:       'Compare Models',
  description: 'Compare Louis Polo luggage side by side: shell material, dimensions, weight, locks, wheels, and warranty.',
}

interface Props {
  searchParams: Promise<{ p?: string }>
}

export default async function ComparePage({ searchParams }: Props) {
  const { p } = await searchParams
  const initialSlugs = p?.split(',').map(s => s.trim()).filter(Boolean)

  return (
    <div className="pt-16 md:pt-[4.5rem]">
      <div className="container-lp section-pad pt-8! md:pt-12!">

        <div className="text-center mb-10 md:mb-14">
          <p className="lp-eyebrow">Compare</p>
          <h1 className="lp-heading-lg">Which one travels with you?</h1>
          <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] mt-3 max-w-md mx-auto">
            Put any three models side by side: materials, dimensions, locks,
            and warranty, aligned so the differences are obvious.
          </p>
        </div>

        <ComparePageClient initialSlugs={initialSlugs} />

      </div>
    </div>
  )
}
