'use client'

// ─────────────────────────────────────────────────────────────────────────────
// components/auth/AuthForm.tsx
// Shared form for both /account/login and /account/signup. The two routes
// exist separately for SEO/bookmarking/middleware redirects, but render this
// one component — switching "mode" inside it animates rather than reloading,
// which is what makes the login<->signup toggle feel like one continuous
// surface instead of two separate page loads.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useTransition } from 'react'
import Link                        from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Phone, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { login, signup, type AuthResult } from '@/app/account/actions'
import { createClient }            from '@/lib/supabase/client'

type Mode = 'login' | 'signup'

interface Props {
  mode: Mode
  redirectTo?: string
}

// ─── Field wrapper — consistent icon + input styling, staggers in ───────────
function Field({
  icon: Icon,
  type,
  name,
  placeholder,
  autoComplete,
}: {
  icon: typeof Mail
  type: string
  name: string
  placeholder: string
  autoComplete?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative"
    >
      <Icon
        size={16}
        strokeWidth={1.5}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-lp-faint)]"
      />
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="w-full h-13 pl-11 pr-4 bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)] font-body text-[0.9rem] text-[var(--color-lp-ink)] placeholder:text-[var(--color-lp-faint)] focus:outline-none focus:border-[var(--color-lp-gold)] transition-colors duration-200"
      />
    </motion.div>
  )
}

export function AuthForm({ mode, redirectTo }: Props) {
  const [isPending, startTransition]   = useTransition()
  const [result, setResult]            = useState<AuthResult | null>(null)
  const [googlePending, setGooglePending] = useState(false)

  async function handleGoogle() {
    setGooglePending(true)
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account/auth/callback`,
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    })
    // Browser will redirect — no need to reset state
  }

  function handleSubmit(formData: FormData) {
    setResult(null)
    startTransition(async () => {
      const action = mode === 'login' ? login : signup
      const res = await action(formData)
      setResult(res)
    })
  }

  // Signup succeeded but needs email confirmation — show a distinct success
  // state rather than letting this fall through to the normal form, since
  // there's nothing left for the user to do here except check their inbox.
  if (result?.needsEmailConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="text-center space-y-4 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 300, damping: 20 }}
        >
          <CheckCircle2 size={48} strokeWidth={1.5} className="text-[var(--color-lp-gold)] mx-auto" />
        </motion.div>
        <h2 className="lp-heading-md">Check your email</h2>
        <p className="font-body text-[0.9rem] text-[var(--color-lp-muted)] max-w-[28ch] mx-auto">
          We've sent a confirmation link. Click it to activate your account.
        </p>
      </motion.div>
    )
  }

  return (
    <div className="w-full max-w-[26rem]">
      {/* ── Mode label, animates between Login / Create Account ──────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.3 }}
        >
          <span className="lp-eyebrow">{mode === 'login' ? 'Welcome back' : 'Join us'}</span>
          <h1 className="lp-heading-lg mb-8">
            {mode === 'login' ? 'Sign in' : 'Create your account'}
          </h1>
        </motion.div>
      </AnimatePresence>

      <form action={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirectTo" value={redirectTo ?? '/'} />
        <AnimatePresence mode="popLayout">
          {mode === 'signup' && (
            <Field key="fullName" icon={User} type="text" name="fullName" placeholder="Full name" autoComplete="name" />
          )}

          <Field key="email" icon={Mail} type="email" name="email" placeholder="Email address" autoComplete="email" />

          {mode === 'signup' && (
            <Field key="phone" icon={Phone} type="tel" name="phone" placeholder="Phone number" autoComplete="tel" />
          )}

          <Field
            key="password"
            icon={Lock}
            type="password"
            name="password"
            placeholder="Password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </AnimatePresence>

        {/* ── Error state ────────────────────────────────────────────────── */}
        <AnimatePresence>
          {result?.error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-2 p-3 bg-[var(--color-lp-error)]/10 border border-[var(--color-lp-error)]/30"
            >
              <AlertCircle size={15} strokeWidth={1.5} className="text-[var(--color-lp-error)] flex-shrink-0 mt-0.5" />
              <p className="font-body text-[0.8rem] text-[var(--color-lp-error)]">{result.error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="submit"
          disabled={isPending}
          whileTap={{ scale: 0.98 }}
          className="btn-primary w-full justify-center mt-2 disabled:opacity-60"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {mode === 'login' ? 'Sign in' : 'Create account'}
              <ArrowRight size={15} strokeWidth={1.5} />
            </>
          )}
        </motion.button>
      </form>

      {/* ── Divider ────────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 mt-5">
        <div className="flex-1 h-px bg-[var(--color-lp-border)]" />
        <span className="font-body text-[0.65rem] tracking-[0.12em] uppercase text-[var(--color-lp-faint)]">or</span>
        <div className="flex-1 h-px bg-[var(--color-lp-border)]" />
      </div>

      {/* ── Google OAuth ───────────────────────────────────────────────────── */}
      <motion.button
        type="button"
        onClick={handleGoogle}
        disabled={googlePending}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full flex items-center justify-center gap-3 h-[3.25rem] border border-[var(--color-lp-border)] bg-white hover:bg-[var(--color-lp-cream)] font-body text-[0.85rem] text-[var(--color-lp-ink)] transition-colors duration-200 disabled:opacity-60"
      >
        {googlePending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <>
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </>
        )}
      </motion.button>

      {/* ── Switch mode ────────────────────────────────────────────────────── */}
      <p className="text-center font-body text-[0.85rem] text-[var(--color-lp-muted)] mt-6">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <Link
          href={mode === 'login' ? '/account/signup' : '/account/login'}
          className="text-[var(--color-lp-ink)] font-medium hover:text-[var(--color-lp-gold)] transition-colors duration-200"
        >
          {mode === 'login' ? 'Create one' : 'Sign in'}
        </Link>
      </p>
    </div>
  )
}
