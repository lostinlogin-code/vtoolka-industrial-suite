export default function Logo({ className = "h-10 md:h-11" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon mark: hexagonal nut with wrench cutout */}
      <svg
        viewBox="0 0 48 48"
        className="h-full w-auto"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="vt-nut" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(215 28% 25%)" />
            <stop offset="100%" stopColor="hsl(215 28% 15%)" />
          </linearGradient>
        </defs>
        {/* Hex nut */}
        <path
          d="M24 2 L42 12 L42 36 L24 46 L6 36 L6 12 Z"
          fill="url(#vt-nut)"
        />
        {/* Inner bevel */}
        <path
          d="M24 6 L38.5 14.25 L38.5 33.75 L24 42 L9.5 33.75 L9.5 14.25 Z"
          fill="none"
          stroke="hsl(215 20% 40%)"
          strokeWidth="0.6"
        />
        {/* Orange wrench mark */}
        <g fill="hsl(24 95% 50%)">
          <path d="M30.4 15.6a6.2 6.2 0 0 0-8.15 7.55l-7.4 7.4a2.1 2.1 0 0 0 2.97 2.97l7.4-7.4a6.2 6.2 0 0 0 7.55-8.15l-3.15 3.15-2.8-.35-.35-2.8 3.93-2.37z" />
        </g>
      </svg>

      {/* Wordmark */}
      <div className="flex flex-col leading-none">
        <span className="font-display font-black text-[1.35rem] md:text-[1.5rem] tracking-tight text-primary">
          v<span className="text-accent">t</span>oolka
        </span>
        <span className="hidden sm:block font-mono text-[0.6rem] tracking-[0.22em] uppercase text-muted-foreground mt-0.5">
          Industrial Tools
        </span>
      </div>
    </div>
  );
}
