// ─────────────────────────────────────────────────────────────────────────────
// components/home/sections/PromoBanner.tsx
// Small static promo strip on the homepage.
// Deliberately static (no marquee, no motion) and a muted red, not an alarm
// red — a quiet aside, not a second version of the top sale ticker.
// ─────────────────────────────────────────────────────────────────────────────

export function PromoBanner() {
  return (
    <div className="bg-[#8B3A3A] py-3 mb-8 md:mb-10 flex items-center justify-center overflow-x-auto scrollbar-hide">
      <p className="flex items-center gap-1.5 sm:gap-2.5 font-body text-[0.6rem] sm:text-[0.72rem] tracking-[0.08em] sm:tracking-[0.16em] uppercase text-lp-porcelain whitespace-nowrap px-2">
        Extra 10% Off for First-Time Buyers
        <span className="text-lp-porcelain/50">·</span>
        Use Code FTB10
      </p>
    </div>
  )
}
