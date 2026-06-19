// ─────────────────────────────────────────────────────────────────────────────
// app/account/(auth)/login/page.tsx
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { AuthForm }      from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Sign In',
}

interface Props {
  searchParams: Promise<{ redirect?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { redirect } = await searchParams
  return <AuthForm mode="login" redirectTo={redirect ?? '/'} />
}
