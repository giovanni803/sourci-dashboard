import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ANNUAL_TARGETS,
  QUARTERLY_TARGETS,
  CONVERSION_BENCHMARKS,
  formatRange,
  formatRangeCurrency,
} from "@/lib/targets";
import {
  WEEKLY_PHASE_TABLE,
  MONTHLY_PHASE_TABLE,
  PHASE_COLUMN_HEADERS,
  OUTBOUND_TOUCHES_TARGETS,
} from "@/lib/sales-cycle-data";
import { getSalesCyclePhase } from "@/lib/sales-cycle";
import { formatAUD, formatPercent, cn } from "@/lib/utils";

export default function TargetsPage() {
  const phase = getSalesCyclePhase();

  return (
    <div className="space-y-6">
      <div className="space-y-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-cyan/80">
          Year 1 plan
        </p>
        <h1 className="text-3xl font-semibold tracking-tightest text-fg-primary">Locked targets</h1>
        <p className="text-sm text-fg-muted">Read-only reference for Janelle's week-by-week tracking.</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <div className="space-y-1">
            <CardTitle>Weekly cadence by phase</CardTitle>
            <p className="text-xs text-fg-muted">
              Per-week numbers. Rolls forward every 35 days from cycle start.
            </p>
          </div>
          <PhasePill phase={phase} />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <PhaseTable
            stageHeader="Sales cycle stage"
            rows={[
              ...WEEKLY_PHASE_TABLE,
              { label: "Outbound touches sent (combined)", values: OUTBOUND_TOUCHES_TARGETS },
            ]}
            activeIndex={phase.index}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low-frequency outcomes, kept monthly</CardTitle>
          <p className="text-xs text-fg-muted">
            Counted by month, not week. Use to gauge cumulative progress against the current phase.
          </p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <PhaseTable
            stageHeader="Sales cycle stage"
            rows={MONTHLY_PHASE_TABLE}
            activeIndex={phase.index}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Annual targets (Year 1)</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="New engagements signed" value={formatRange(ANNUAL_TARGETS.newEngagementsSigned)} accent="cyan" />
            <Stat label="Production POs closed" value={formatRange(ANNUAL_TARGETS.productionPosClosed)} accent="lime" />
            <Stat label="Closed revenue" value={formatRangeCurrency(ANNUAL_TARGETS.closedRevenueAud)} accent="magenta" />
            <Stat label="Pipeline committed" value={`${formatAUD(ANNUAL_TARGETS.pipelineValueAud, { compact: true })}+`} accent="purple" />
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quarterly targets</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
                <th className="py-2.5 font-semibold">Quarter</th>
                <th className="py-2.5 font-semibold">New engagements</th>
                <th className="py-2.5 font-semibold">POs closing</th>
                <th className="py-2.5 font-semibold">Revenue closing</th>
              </tr>
            </thead>
            <tbody>
              {QUARTERLY_TARGETS.map((q) => (
                <tr key={q.quarter} className="border-b border-white/[0.05]">
                  <td className="py-3 font-medium text-neon-cyan">{q.quarter}</td>
                  <td className="py-3 text-fg-secondary tabular-nums">{formatRange(q.newEngagements)}</td>
                  <td className="py-3 text-fg-secondary tabular-nums">{formatRange(q.posClosing)}</td>
                  <td className="py-3 text-fg-secondary tabular-nums">{formatRangeCurrency(q.revenueClosing)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Conversion benchmarks</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06] text-left text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
                <th className="py-2.5 font-semibold">Stage</th>
                <th className="py-2.5 text-right font-semibold">Target rate</th>
              </tr>
            </thead>
            <tbody>
              {CONVERSION_BENCHMARKS.map((b) => (
                <tr key={b.key} className="border-b border-white/[0.05]">
                  <td className="py-3 text-fg-secondary">{b.label}</td>
                  <td className="py-3 text-right font-medium text-neon-cyan tabular-nums">
                    {b.min === b.max ? formatPercent(b.min, 0) : `${formatPercent(b.min, 0)} – ${formatPercent(b.max, 0)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function PhaseTable({
  stageHeader,
  rows,
  activeIndex,
}: {
  stageHeader: string;
  rows: { label: string; values: readonly string[] }[];
  activeIndex: 0 | 1 | 2 | 3;
}) {
  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/[0.06] text-left text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
          <th className="py-2.5 pr-3 font-semibold">{stageHeader}</th>
          {PHASE_COLUMN_HEADERS.map((h, i) => (
            <th
              key={h}
              className={cn(
                "py-2.5 px-3 text-right font-semibold transition-colors",
                i === activeIndex && "text-neon-cyan"
              )}
            >
              {h}
              {i === activeIndex && (
                <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-neon-cyan align-middle shadow-glow-cyan" />
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-white/[0.05]">
            <td className="py-3 pr-3 text-fg-secondary">{row.label}</td>
            {row.values.map((v, i) => (
              <td
                key={i}
                className={cn(
                  "py-3 px-3 text-right tabular-nums transition-colors",
                  i === activeIndex
                    ? "font-semibold text-neon-cyan bg-neon-cyan/[0.05]"
                    : "text-fg-primary"
                )}
              >
                {v}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function PhasePill({ phase }: { phase: ReturnType<typeof getSalesCyclePhase> }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-neon-cyan/30 bg-neon-cyan/[0.06] px-3 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-neon-cyan shadow-glow-cyan" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-neon-cyan">Current</span>
      <span className="text-xs font-medium text-fg-primary">{phase.label}</span>
      {phase.daysUntilNext !== null && phase.nextLabel && (
        <span className="text-[11px] text-fg-muted">
          · {phase.daysUntilNext}d to {phase.nextLabel}
        </span>
      )}
    </div>
  );
}

const accentMap = {
  cyan: { text: "text-neon-cyan", dot: "bg-neon-cyan shadow-glow-cyan" },
  lime: { text: "text-neon-lime", dot: "bg-neon-lime shadow-glow-lime" },
  magenta: { text: "text-neon-magenta", dot: "bg-neon-magenta shadow-glow-magenta" },
  purple: { text: "text-neon-purple", dot: "bg-neon-purple" },
  amber: { text: "text-neon-amber", dot: "bg-neon-amber shadow-glow-amber" },
} as const;

function Stat({ label, value, accent = "cyan" }: { label: string; value: string; accent?: keyof typeof accentMap }) {
  const a = accentMap[accent];
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3.5 transition-colors duration-150 hover:border-white/[0.12]">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${a.dot}`} />
        {label}
      </div>
      <div className={`text-lg font-semibold tracking-tight ${a.text}`}>{value}</div>
    </div>
  );
}
