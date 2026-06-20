// ─────────────────────────────────────────────────────────────────────────────
// app/account/auth/callback/route.ts
// Supabase redirects here after Google (or any OAuth) sign-in.
// We exchange the one-time `code` for a real session, then send the user on.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@/lib/supabase/server'
import { NextResponse }  from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/account'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/account/login?error=oauth_failed`)
}
