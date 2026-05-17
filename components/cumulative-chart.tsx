"use client";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CumulativeRow } from "@/lib/analytics";
import { ANNUAL_TARGETS } from "@/lib/targets";

export function CumulativeChart({ data }: { data: CumulativeRow[] }) {
  const targetMax = ANNUAL_TARGETS.newEngagementsSigned.max;
  const targetMin = ANNUAL_TARGETS.newEngagementsSigned.min;
  const totalWeeks = 52;
  const enriched = data.map((row, i) => ({
    ...row,
    bandMin: ((i + 1) / totalWeeks) * targetMin,
    bandMax: ((i + 1) / totalWeeks) * targetMax,
  }));

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-[11px] text-fg-muted">
        <LegendDot color="#00E5FF" label="Engagements" />
        <LegendDot color="#A6FF4D" label="Production POs" />
        <LegendDot color="rgba(168,85,247,0.35)" label="Target band" muted />
      </div>
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={enriched} margin={{ top: 8, right: 12, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="bandGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A855F7" stopOpacity={0.18} />
                <stop offset="100%" stopColor="#A855F7" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="engGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00E5FF" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="poGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A6FF4D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#A6FF4D" stopOpacity={0} />
              </linearGradient>
              <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2.5" result="blur" />
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
              allowDecimals={false}
              width={36}
            />
            <Tooltip cursor={{ stroke: "rgba(255,255,255,0.1)", strokeWidth: 1 }} />
            <Area type="monotone" dataKey="bandMax" stroke="none" fill="url(#bandGradient)" name="Target band" />
            <Area type="monotone" dataKey="engagements" stroke="none" fill="url(#engGradient)" />
            <Area type="monotone" dataKey="pos" stroke="none" fill="url(#poGradient)" />
            <Line
              type="monotone"
              dataKey="engagements"
              stroke="#00E5FF"
              strokeWidth={2.25}
              dot={{ r: 3, fill: "#00E5FF", stroke: "#00E5FF", strokeWidth: 1 }}
              activeDot={{ r: 5, fill: "#00E5FF", stroke: "#0A0A0B", strokeWidth: 2 }}
              filter="url(#lineGlow)"
              name="Engagements"
            />
            <Line
              type="monotone"
              dataKey="pos"
              stroke="#A6FF4D"
              strokeWidth={2.25}
              dot={{ r: 3, fill: "#A6FF4D", stroke: "#A6FF4D", strokeWidth: 1 }}
              activeDot={{ r: 5, fill: "#A6FF4D", stroke: "#0A0A0B", strokeWidth: 2 }}
              filter="url(#lineGlow)"
              name="Production POs"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function LegendDot({ color, label, muted }: { color: string; label: string; muted?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color, boxShadow: muted ? undefined : `0 0 8px ${color}` }}
      />
      {label}
    </span>
  );
}
