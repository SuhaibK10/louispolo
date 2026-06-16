// ─────────────────────────────────────────────────────────────────────────────
// lib/supabase/server.ts
// Server-side Supabase client. Use this inside Server Components, Server
// Actions, and Route Handlers (app/api/*/route.ts).
//
// IMPORTANT: must be created fresh on every request (a function call, not a
// module-level singleton) — it reads cookies from the current request's
// cookie store, which differs per request.
// ─────────────────────────────────────────────────────────────────────────────

import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll is called from a Server Component, which can't set
            // cookies directly. This is safe to ignore IF you have
            // middleware refreshing the session (see middleware.ts) —
            // the middleware will pick up the refresh on the next request.
          }
        },
      },
    }
  )
}

// ─── Service-role client ──────────────────────────────────────────────────
// Bypasses RLS entirely. ONLY use this in trusted server-side code that
// needs to write data on behalf of a verified action — e.g. the Razorpay
// payment verification route, where we mark an order 'paid' after
// confirming the signature ourselves (a user should never be able to do
// this directly, hence no RLS update policy on orders for regular users).
//
// NEVER import this into anything that runs client-side. NEVER pass the
// service role key to the browser.
export function createServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}