import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  title: string;
  subtitle?: string;
  value: string;
  targetLabel?: string;
  progressMax?: number;
  progressValue?: number;
  tone?: "default" | "good" | "warn" | "bad";
}

const toneMap = {
  default: {
    accent: "from-neon-cyan via-neon-cyan/60 to-transparent",
    bar: "bg-neon-cyan",
    glow: "shadow-glow-cyan",
    text: "text-glow-cyan",
    dot: "bg-neon-cyan",
  },
  good: {
    accent: "from-neon-lime via-neon-lime/60 to-transparent",
    bar: "bg-neon-lime",
    glow: "shadow-glow-lime",
    text: "text-glow-lime",
    dot: "bg-neon-lime",
  },
  warn: {
    accent: "from-neon-amber via-neon-amber/60 to-transparent",
    bar: "bg-neon-amber",
    glow: "shadow-glow-amber",
    text: "text-glow-amber",
    dot: "bg-neon-amber",
  },
  bad: {
    accent: "from-neon-red via-neon-red/60 to-transparent",
    bar: "bg-neon-red",
    glow: "shadow-glow-red",
    text: "text-glow-red",
    dot: "bg-neon-red",
  },
} as const;

export function KpiCard({
  title,
  subtitle,
  value,
  targetLabel,
  progressMax,
  progressValue,
  tone = "default",
}: KpiCardProps) {
  const t = toneMap[tone];
  return (
    <Card className="relative overflow-hidden">
      {/* Top neon accent line */}
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r", t.accent)} />
      <div className={cn("absolute -top-px left-6 h-1 w-12 rounded-full", t.bar, t.glow, "opacity-70")} />

      <CardHeader className="pb-1.5">
        <div className="flex items-center gap-2">
          <span className={cn("h-1.5 w-1.5 rounded-full", t.dot, t.glow)} />
          <CardTitle className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
            {title}
          </CardTitle>
        </div>
        {subtitle && <p className="text-xs text-fg-muted">{subtitle}</p>}
      </CardHeader>
      <CardContent className="space-y-3">
        <div
          className={cn(
            "text-[2.25rem] font-semibold leading-none tracking-tightest text-fg-primary",
            tone !== "default" && t.text
          )}
        >
          {value}
        </div>
        {targetLabel && (
          <p className="text-[11px] text-fg-muted">
            <span className="text-fg-subtle">Target </span>
            {targetLabel}
          </p>
        )}
        {progressMax !== undefined && progressValue !== undefined && (
          <Progress
            value={progressValue}
            max={progressMax}
            indicatorClassName={t.bar}
            glowClassName={t.glow}
          />
        )}
      </CardContent>
    </Card>
  );
}
