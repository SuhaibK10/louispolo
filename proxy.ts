// ─────────────────────────────────────────────────────────────────────────────
// middleware.ts
// Refreshes the Supabase session on every request. Without this, sessions
// expire silently mid-browse — the cookie goes stale and the user appears
// logged out with no clear cause. This runs before every page/route render.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'crypto'

export async function proxy(request: NextRequest) {
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
    !request.nextUrl.pathname.startsWith('/account/signup') &&
    !request.nextUrl.pathname.startsWith('/account/auth')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/account/login'
    return NextResponse.redirect(url)
  }

  // Protect /admin/* pages AND /api/admin/* routes — shared-password gate,
  // separate from the customer Supabase auth above. Derived-token cookie so
  // the cookie value itself can't be reversed into the password if it ever
  // leaks. The API route needs covering too, not just the page — otherwise
  // the underlying data (image list, product cross-reference) is reachable
  // directly even with the page itself gated.
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')
  const isAdminApi  = request.nextUrl.pathname.startsWith('/api/admin')
  if (isAdminPage || isAdminApi) {
    const expected = crypto
      .createHmac('sha256', process.env.ADMIN_PASSWORD!)
      .update('louispolo-admin')
      .digest('hex')
    if (request.cookies.get('admin_session')?.value !== expected) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }
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
     * - api/shopify-assistant (called from the Shopify site: no session, so the
     *   Supabase check would only add latency to every chat message)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/shopify-assistant|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}