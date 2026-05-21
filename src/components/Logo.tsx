export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width="36" height="36" viewBox="0 0 40 40" fill="none" aria-hidden>
        <defs>
          <linearGradient id="lg" x1="0" y1="0" x2="40" y2="40">
            <stop offset="0%" stopColor="oklch(0.78 0.11 220)" />
            <stop offset="60%" stopColor="oklch(0.45 0.16 240)" />
            <stop offset="100%" stopColor="oklch(0.25 0.09 250)" />
          </linearGradient>
        </defs>
        <path d="M20 2 L36 12 V28 L20 38 L4 28 V12 Z" fill="url(#lg)" />
        <text x="20" y="26" textAnchor="middle" fontFamily="Georgia,serif" fontSize="18" fontWeight="700" fill="white">F</text>
      </svg>
      <div className="leading-tight">
        <div style={{ fontFamily: "var(--font-display)" }} className="text-lg font-semibold tracking-wide text-foreground">
          Favorite Trading
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground -mt-0.5">INC · Brooklyn</div>
      </div>
    </div>
  );
}
