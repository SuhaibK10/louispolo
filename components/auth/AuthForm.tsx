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

type Mode = 'login' | 'signup'

interface Props {
  mode: Mode
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

export function AuthForm({ mode }: Props) {
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<AuthResult | null>(null)

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
