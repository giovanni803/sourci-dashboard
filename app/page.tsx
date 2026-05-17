import { getAllWeeklyEntries } from "@/lib/db";
import { buildSnapshot } from "@/lib/analytics";
import { getSalesCyclePhase } from "@/lib/sales-cycle";
import { KpiCard } from "@/components/kpi-card";
import { ActivityChart } from "@/components/activity-chart";
import { CumulativeChart } from "@/components/cumulative-chart";
import { FunnelViewComponent } from "@/components/funnel-view";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatAUD, formatNumber } from "@/lib/utils";
import { formatRange, formatRangeCurrency } from "@/lib/targets";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const entries = getAllWeeklyEntries();
  const snap = buildSnapshot(entries);
  const phase = getSalesCyclePhase();
  const empty = entries.length === 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neon-cyan/80">
            Year 1 · Q{snap.currentQuarter}
          </p>
          <h1 className="text-3xl font-semibold tracking-tightest text-fg-primary">Sales dashboard</h1>
          <p className="text-sm text-fg-muted">
            Tracking Janelle against locked 12-month targets.
          </p>
        </div>
        <Link
          href="/submit"
          className="group inline-flex items-center gap-2 rounded-md bg-neon-cyan px-4 py-2 text-sm font-medium text-bg-base transition-all duration-200 ease-smooth hover:shadow-glow-cyan hover:brightness-110"
        >
          Submit this week
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
        </Link>
      </div>

      {empty && (
        <Card>
          <CardContent className="py-5 text-sm text-fg-muted">
            No weekly entries yet. Head to{" "}
            <Link href="/submit" className="font-medium text-neon-cyan hover:underline">
              Submit Week
            </Link>{" "}
            to add the first one. All metrics below will populate from real entries.
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title={`Engagements · Q${snap.currentQuarter}`}
          value={formatNumber(snap.engagementsQuarter)}
          targetLabel={`${formatRange(snap.engagementsQuarterTarget)} this quarter`}
          progressValue={snap.engagementsQuarter}
          progressMax={Math.max(snap.engagementsQuarterTarget.max, 1)}
          tone={
            snap.engagementsQuarter >= snap.engagementsQuarterTarget.min
              ? "good"
              : snap.engagementsQuarter >= snap.engagementsQuarterTarget.min * 0.75
              ? "warn"
              : "bad"
          }
        />
        <KpiCard
          title="Production POs · YTD"
          value={formatNumber(snap.posYtd)}
          targetLabel={`${formatRange(snap.posYtdTarget)} for Year 1`}
          progressValue={snap.posYtd}
          progressMax={Math.max(snap.posYtdTarget.max, 1)}
          tone={
            snap.posYtd >= snap.posYtdTarget.min
              ? "good"
              : snap.posYtd >= snap.posYtdTarget.min * 0.75
              ? "warn"
              : "bad"
          }
        />
        <KpiCard
          title="Closed revenue · YTD"
          value={formatAUD(snap.revenueYtd, { compact: true })}
          targetLabel={`${formatRangeCurrency(snap.revenueYtdTarget)} for Year 1`}
          progressValue={snap.revenueYtd}
          progressMax={Math.max(snap.revenueYtdTarget.max, 1)}
          tone={
            snap.revenueYtd >= snap.revenueYtdTarget.min
              ? "good"
              : snap.revenueYtd >= snap.revenueYtdTarget.min * 0.75
              ? "warn"
              : "bad"
          }
        />
        <KpiCard
          title="Pipeline value · latest"
          subtitle={`${snap.samplesActiveLatest} active sample programs`}
          value={formatAUD(snap.pipelineValueLatest, { compact: true })}
          targetLabel={`${formatAUD(5_000_000, { compact: true })}+ committed`}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly activity vs target</CardTitle>
            <p className="text-xs text-fg-muted">
              Last 8 weeks · dashed line = {phase.shortLabel} weekly target.
            </p>
          </CardHeader>
          <CardContent>
            {snap.weeklyActivity.length === 0 ? (
              <p className="py-12 text-center text-sm text-fg-muted">No data yet.</p>
            ) : (
              <ActivityChart data={snap.weeklyActivity} phase={phase} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Cumulative engagements & POs</CardTitle>
            <p className="text-xs text-fg-muted">Shaded band = annual target trajectory.</p>
          </CardHeader>
          <CardContent>
            {snap.cumulative.length === 0 ? (
              <p className="py-12 text-center text-sm text-fg-muted">No data yet.</p>
            ) : (
              <CumulativeChart data={snap.cumulative} />
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sales funnel · last 90 days</CardTitle>
          <p className="text-xs text-fg-muted">
            Conversion rate vs benchmark. <span className="text-neon-lime">Green</span> at/above target,{" "}
            <span className="text-neon-amber">amber</span> within 25% below,{" "}
            <span className="text-neon-red">red</span> &gt; 25% below.
          </p>
        </CardHeader>
        <CardContent>
          <FunnelViewComponent funnel={snap.funnel} />
        </CardContent>
      </Card>
    </div>
  );
}
