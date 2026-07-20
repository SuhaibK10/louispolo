export default function AccountLoading() {
  return (
    <div className="pt-16 md:pt-20 min-h-screen">
      <div className="container-lp section-pad max-w-152 pt-8! md:pt-10!">

        {/* Avatar + name skeleton */}
        <div className="flex items-center gap-4 mb-10 animate-pulse">
          <div className="w-14 h-14 rounded-full bg-[var(--color-lp-cream)] flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-[var(--color-lp-cream)] rounded" />
            <div className="h-3.5 w-48 bg-[var(--color-lp-cream)] rounded" />
          </div>
        </div>

        {/* Quick links grid skeleton */}
        <div className="grid grid-cols-2 gap-3 mb-8 animate-pulse">
          <div className="h-[68px] bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)]" />
          <div className="h-[68px] bg-[var(--color-lp-cream)] border border-[var(--color-lp-border)]" />
        </div>

        {/* Account details skeleton */}
        <div className="border border-[var(--color-lp-border)] mb-6 animate-pulse">
          <div className="px-5 py-4 border-b border-[var(--color-lp-border)]">
            <div className="h-3 w-28 bg-[var(--color-lp-cream)] rounded" />
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="px-5 py-3.5 flex justify-between border-b border-[var(--color-lp-border)] last:border-0">
              <div className="h-3 w-16 bg-[var(--color-lp-cream)] rounded" />
              <div className="h-3 w-32 bg-[var(--color-lp-cream)] rounded" />
            </div>
          ))}
        </div>

        {/* Orders skeleton */}
        <div className="border border-[var(--color-lp-border)] mb-8 animate-pulse">
          <div className="px-5 py-4 border-b border-[var(--color-lp-border)]">
            <div className="h-3 w-16 bg-[var(--color-lp-cream)] rounded" />
          </div>
          {[1, 2].map((i) => (
            <div key={i} className="px-5 py-4 border-b border-[var(--color-lp-border)] last:border-0 space-y-2">
              <div className="flex justify-between">
                <div className="h-3 w-28 bg-[var(--color-lp-cream)] rounded" />
                <div className="h-3 w-16 bg-[var(--color-lp-cream)] rounded" />
              </div>
              <div className="h-3 w-48 bg-[var(--color-lp-cream)] rounded" />
              <div className="h-2.5 w-24 bg-[var(--color-lp-cream)] rounded" />
            </div>
          ))}
        </div>

        {/* Sign out skeleton */}
        <div className="h-3 w-20 bg-[var(--color-lp-cream)] rounded animate-pulse" />

      </div>
    </div>
  )
}
