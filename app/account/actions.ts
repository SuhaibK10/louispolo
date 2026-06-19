// ─────────────────────────────────────────────────────────────────────────────
// app/account/actions.ts
// Server Actions for auth. Run server-side only — password never touches
// client-side JS beyond the form submission itself, unlike a client fetch()
// to an API route, which would show the payload in browser devtools.
// ─────────────────────────────────────────────────────────────────────────────

'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export interface AuthResult {
  error?: string
  // Signup-specific: Supabase has email confirmation ON by default, so a
  // successful signup call does NOT mean the user is logged in yet — they
  // need to click the link in their inbox first. We surface this distinctly
  // from a hard error so the UI can show "check your email" instead of
  // either a false error or a false "you're in" state.
  needsEmailConfirmation?: boolean
}

function safeRedirectTarget(redirectTo: FormDataEntryValue | null): string {
  if (typeof redirectTo === 'string' && redirectTo.startsWith('/') && !redirectTo.includes('://')) {
    return redirectTo
  }
  return '/'
}

export async function login(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email      = formData.get('email') as string
  const password   = formData.get('password') as string
  const redirectTo = safeRedirectTarget(formData.get('redirectTo'))

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Supabase returns "Invalid login credentials" for both wrong password
    // AND non-existent email — this is intentional on their end, prevents
    // leaking which emails are registered. We pass it through as-is.
    return { error: error.message }
  }

  redirect(redirectTo)
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const supabase = await createClient()

  const email      = formData.get('email') as string
  const password   = formData.get('password') as string
  const fullName   = formData.get('fullName') as string
  const phone      = formData.get('phone') as string
  const redirectTo = safeRedirectTarget(formData.get('redirectTo'))

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,  // read by the handle_new_user() trigger in the DB
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/account/auth/confirm`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Phone isn't part of auth.users — it lives on profiles, and the trigger
  // only sets full_name from raw_user_meta_data. Update phone separately
  // once we have a user id back.
  if (data.user && phone) {
    await supabase
      .from('profiles')
      .update({ phone })
      .eq('id', data.user.id)
  }

  // If email confirmation is required, Supabase returns a user object but
  // no active session — identity_data will be empty in that case for a
  // brand new signup. The reliable signal is checking session presence.
  if (data.user && !data.session) {
    return { needsEmailConfirmation: true }
  }

  redirect(redirectTo)
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/account/login')
}
