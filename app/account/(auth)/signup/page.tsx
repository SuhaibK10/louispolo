// ─────────────────────────────────────────────────────────────────────────────
// app/account/(auth)/signup/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { AuthForm }      from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title:  'Create Account',
  robots: { index: false },
}

export default function SignupPage() {
  return <AuthForm mode="signup" />
}
