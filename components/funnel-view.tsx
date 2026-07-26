import { FunnelView } from "@/lib/analytics";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

const toneClasses: Record<
  string,
  { bar: string; pill: string; glow: string; color: string }
> = {
  green: {
    bar: "from-neon-lime/90 via-neon-lime/60 to-neon-lime/20",
    pill: "bg-neon-lime/10 text-neon-lime border-neon-lime/30",
    glow: "shadow-glow-lime",
    color: "#A6FF4D",
  },
  amber: {
    bar: "from-neon-amber/90 via-neon-amber/60 to-neon-amber/20",
    pill: "bg-neon-amber/10 text-neon-amber border-neon-amber/30",
    glow: "shadow-glow-amber",
    color: "#FFB020",
  },
  red: {
    bar: "from-neon-red/90 via-neon-red/60 to-neon-red/20",
    pill: "bg-neon-red/10 text-neon-red border-neon-red/30",
    glow: "shadow-glow-red",
    color: "#FF4D6D",
  },
  neutral: {
    bar: "from-neon-cyan/80 via-neon-cyan/50 to-neon-cyan/10",
    pill: "bg-white/[0.04] text-fg-muted border-white/10",
    glow: "shadow-glow-cyan",
    color: "#00E5FF",
  },
};

export function FunnelViewComponent({ funnel }: { funnel: FunnelView }) {
  const maxCount = Math.max(1, ...funnel.steps.map((s) => s.count));
  return (
    <div className="space-y-2.5">
      {funnel.steps.map((s, idx) => {
        const tone = toneClasses[s.status];
        const widthPct = Math.max(10, (s.count / maxCount) * 100);
        return (
          <div key={idx} className="grid grid-cols-12 items-center gap-3">
            <div className="col-span-3 text-xs font-medium text-fg-secondary sm:col-span-2">
              {s.label}
            </div>
            <div className="col-span-6 sm:col-span-7">
              <div className="relative h-7 w-full overflow-hidden rounded-md bg-white/[0.03] ring-1 ring-inset ring-white/[0.05]">
                <div
                  className={cn(
                    "flex h-full items-center justify-end rounded-md bg-gradient-to-r px-2.5 text-[11px] font-semibold text-bg-base transition-all duration-500 ease-smooth",
                    tone.bar
                  )}
                  style={{
                    width: `${widthPct}%`,
                    boxShadow: `inset 0 0 0 1px ${tone.color}55, 0 0 16px ${tone.color}30`,
                  }}
                >
                  <span style={{ color: "#0A0A0B" }}>{formatNumber(s.count)}</span>
                </div>
              </div>
            </div>
            <div className="col-span-3 text-right text-xs">
              {s.conversion !== null ? (
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold tracking-tight text-fg-primary">
                    {formatPercent(s.conversion)}
                  </span>
                  {s.benchmarkMin !== null && (
                    <span className={cn("rounded border px-1.5 py-0.5 text-[10px] font-medium", tone.pill)}>
                      vs {formatPercent(s.benchmarkMin, 0)}
                      {s.benchmarkMin !== s.benchmarkMax && `–${formatPercent(s.benchmarkMax!, 0)}`}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-fg-subtle">-</span>
              )}
            </div>
          </div>
        );
      })}
      <p className="pt-3 text-[11px] text-fg-muted">Window: {funnel.windowLabel}.</p>
    </div>
  );
}
