// ─────────────────────────────────────────────────────────────────────────────
// lib/supabase/client.ts
// Browser-side Supabase client. Use this ONLY inside 'use client' components.
// Reads/writes session via document.cookie automatically.
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}