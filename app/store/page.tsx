// ─────────────────────────────────────────────────────────────────────────────
// app/store/page.tsx  (renders at /)
// Homepage — delegates entirely to HomeEditorial.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata }   from 'next'
import { HomeEditorial }   from '@/components/home/HomeEditorial'
import { SEO }             from '@/lib/constants'

export const metadata: Metadata = {
  title:       SEO.title,
  description: SEO.description,
}

export default function HomePage() {
  return <HomeEditorial />
}
