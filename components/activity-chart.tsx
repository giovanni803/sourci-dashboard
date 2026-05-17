"use client";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  ReferenceLine,
  Cell,
} from "recharts";
import { WeeklyActivityRow } from "@/lib/analytics";
import {
  PhaseInfo,
  outboundChannelTargetNumeric,
  weeklyTargetNumeric,
} from "@/lib/sales-cycle-data";
import { cn } from "@/lib/utils";

const METRICS = [
  { key: "new_prospects_added",       label: "Prospects",       color: "#00E5FF" },
  { key: "cold_emails_sent",          label: "Cold emails",     color: "#FF2D9C" },
  { key: "linkedin_requests_sent",    label: "LinkedIn",        color: "#A855F7" },
  { key: "discovery_calls_completed", label: "Discovery calls", color: "#A6FF4D" },
  { key: "proposals_issued",          label: "Proposals",       color: "#FFB020" },
] as const;

function targetFor(metricKey: string, phaseIndex: 0 | 1 | 2 | 3): number | null {
  if (metricKey === "cold_emails_sent" || metricKey === "linkedin_requests_sent") {
    return outboundChannelTargetNumeric(phaseIndex);
  }
  return weeklyTargetNumeric(metricKey, phaseIndex);
}

export function ActivityChart({ data, phase }: { data: WeeklyActivityRow[]; phase: PhaseInfo }) {
  const [metric, setMetric] = useState<(typeof METRICS)[number]["key"]>("new_prospects_added");
  const m = METRICS.find((mm) => mm.key === metric)!;
  const target = targetFor(metric, phase.index);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((mm) => {
            const active = metric === mm.key;
            return (
              <button
                key={mm.key}
                onClick={() => setMetric(mm.key)}
                className={cn(
                  "rounded-md px-2.5 py-1 text-[11px] font-medium transition-all duration-200 ease-smooth border",
                  active
                    ? "border-white/[0.14] bg-white/[0.06] text-fg-primary"
                    : "border-transparent bg-white/[0.02] text-fg-muted hover:text-fg-secondary hover:bg-white/[0.04]"
                )}
                style={active ? { color: mm.color, boxShadow: `0 0 16px ${mm.color}40` } : undefined}
              >
                <span
                  className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle"
                  style={{ backgroundColor: mm.color, boxShadow: `0 0 8px ${mm.color}` }}
                />
                {mm.label}
              </button>
            );
          })}
        </div>
        <span className="text-[10.5px] text-fg-muted">
          Targets · <span className="text-fg-secondary">{phase.label}</span>
        </span>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 12, left: -8, bottom: 0 }} barCategoryGap="22%">
            <defs>
              <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={m.color} stopOpacity={0.95} />
                <stop offset="60%" stopColor={m.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={m.color} stopOpacity={0.05} />
              </linearGradient>
              <filter id="barGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <CartesianGrid strokeDasharray="3 6" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="weekLabel"
              stroke="rgba(255,255,255,0.25)"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8F97", fontSize: 11 }}
            />
            <YAxis
              stroke="rgba(255,255,255,0.25)"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#8B8F97", fontSize: 11 }}
              width={36}
            />
            <Tooltip cursor={{ fill: "rgba(255,255,255,0.04)" }} />
            {target !== null && (
              <ReferenceLine
                y={target}
                stroke={m.color}
                strokeOpacity={0.55}
                strokeDasharray="4 4"
                label={{
                  value: `${phase.shortLabel} target ${formatTargetTick(target)}`,
                  position: "right",
                  fontSize: 10,
                  fill: m.color,
                }}
              />
            )}
            <Bar
              dataKey={metric}
              name={m.label}
              radius={[6, 6, 0, 0]}
              fill="url(#barGradient)"
              stroke={m.color}
              strokeWidth={1}
              filter="url(#barGlow)"
            >
              {data.map((_, i) => (
                <Cell key={i} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      {target === null && (
        <p className="text-[10.5px] text-fg-muted">
          No weekly target for this metric in {phase.label} — tracked as a monthly outcome.
        </p>
      )}
    </div>
  );
}

function formatTargetTick(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}
