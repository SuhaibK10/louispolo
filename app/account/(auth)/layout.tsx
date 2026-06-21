// ─────────────────────────────────────────────────────────────────────────────
// app/account/(auth)/layout.tsx
// Shared frame for /login and /signup — NOT used by other /account/* pages,
// which get the full Navbar/Footer via the parent store layout. Auth pages
// get this focused, distraction-free frame instead since the goal is
// completing one task, not browsing.
// ─────────────────────────────────────────────────────────────────────────────

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-lp-porcelain flex items-center justify-center px-6 pt-28 pb-24 md:py-16">
      {children}
    </div>
  )
}
