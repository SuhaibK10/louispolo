// ─────────────────────────────────────────────────────────────────────────────
// app/page.tsx
// Root page — redirect to /store (the homepage).
// Using redirect() so it's instant and SEO-safe.
// ─────────────────────────────────────────────────────────────────────────────

import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/store')
}
