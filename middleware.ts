// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts
// Refreshes the Supabase session on every request. Without this, sessions
// expire silently mid-browse — the cookie goes stale and the user appears
// logged out with no clear cause. This runs before every page/route render.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: do not run any code between createServerClient and
  // supabase.auth.getUser(). Doing so risks intermittent, hard-to-debug
  // session refresh issues — this is Supabase's own guidance, not an
  // assumption, because the auth call must happen immediately to
  // correctly trigger the cookie refresh logic above.
  const { data: { user } } = await supabase.auth.getUser()

  // Protect /account/* routes — redirect to login if not authenticated.
  // Checkout itself is NOT gated here; that's enforced in the checkout
  // route handler instead, since redirecting mid-cart-flow via middleware
  // is a worse UX than handling it inline with the checkout UI.
  if (
    !user &&
    request.nextUrl.pathname.startsWith('/account') &&
    !request.nextUrl.pathname.startsWith('/account/login') &&
    !request.nextUrl.pathname.startsWith('/account/signup')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/account/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - image files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}