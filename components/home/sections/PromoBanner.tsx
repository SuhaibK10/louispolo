// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/PromoBanner.tsx
// Scrolling promo ticker on the homepage, between the category grid and
// Best Sellers. Reuses the same .animate-marquee mechanic (see globals.css)
// as the navbar's sale ticker — a quiet charcoal aside rather than a second
// version of that ticker (which is itself currently disabled, so there's
// no motion clash between the two).
// ─────────────────────────────────────────────────────────────────────────────

export function PromoBanner() {
  return (
    <div className="bg-[#36454F] py-3 md:py-3.5 mb-8 md:mb-10 overflow-hidden">
      {/* Faster than the shared 80s default (see .animate-marquee in
          globals.css) — a promo ticker should feel brisk, not ambient, so
          the duration is overridden here rather than on the shared class. */}
      <div className="animate-marquee" style={{ animationDuration: '16s' }}>
        {[0, 1].map((rep) => (
          <div key={rep} className="flex items-center shrink-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <span
                key={i}
                className="flex items-center gap-1.5 sm:gap-2 px-6 font-body font-semibold text-[0.75rem] sm:text-[0.9rem] tracking-[0.06em] sm:tracking-[0.08em] uppercase text-lp-porcelain whitespace-nowrap"
              >
                Extra 10% Off for First-Time Buyers
                <span className="text-lp-porcelain/50">·</span>
                Use Code FTB10
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
