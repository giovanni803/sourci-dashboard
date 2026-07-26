"use client";
import { useState } from "react";
import type { WeeklyEntry } from "@/lib/weekly-shared";
import { formatAUD, formatNumber } from "@/lib/utils";
import { formatDateShort } from "@/lib/format";

export function HistoryTable({ entries }: { entries: WeeklyEntry[] }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  if (entries.length === 0) {
    return <p className="py-8 text-center text-sm text-fg-muted">No entries yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/[0.06] text-left text-[10.5px] uppercase tracking-[0.12em] text-fg-muted">
            <th className="py-2.5 pr-3 font-semibold">Week</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Prospects</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Calls</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Proposals</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Engagements</th>
            <th className="py-2.5 pr-3 text-right font-semibold">POs</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Revenue</th>
            <th className="py-2.5 pr-3 text-right font-semibold">Pipeline</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => {
            const isOpen = expanded === e.id;
            return (
              <>
                <tr
                  key={e.id}
                  onClick={() => setExpanded(isOpen ? null : e.id)}
                  className="cursor-pointer border-b border-white/[0.05] transition-colors duration-150 hover:bg-white/[0.02]"
                >
                  <td className="py-3 pr-3">
                    <div className="font-medium text-fg-primary">
                      Week {e.iso_week}, {e.iso_year}
                    </div>
                    <div className="text-xs text-fg-muted">
                      {formatDateShort(e.week_start_date)} – {formatDateShort(e.week_end_date)}
                    </div>
                  </td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatNumber(e.new_prospects_added)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatNumber(e.discovery_calls_completed)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatNumber(e.proposals_issued)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-neon-cyan">{formatNumber(e.engagements_signed)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums text-neon-lime">{formatNumber(e.production_pos_signed)}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatAUD(e.production_po_value_aud, { compact: true })}</td>
                  <td className="py-3 pr-3 text-right tabular-nums">{formatAUD(e.pipeline_value_aud, { compact: true })}</td>
                </tr>
                {isOpen && (
                  <tr key={`${e.id}-notes`} className="border-b border-white/[0.05] bg-white/[0.02]">
                    <td colSpan={8} className="p-4">
                      <div className="grid gap-4 sm:grid-cols-3">
                        <NoteBlock title="What's working" value={e.whats_working} accent="lime" />
                        <NoteBlock title="What's not" value={e.whats_not} accent="red" />
                        <NoteBlock title="Ask of Gio" value={e.ask_of_gio} accent="cyan" />
                      </div>
                    </td>
                  </tr>
                )}
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NoteBlock({ title, value, accent }: { title: string; value: string; accent: "lime" | "red" | "cyan" }) {
  const dot =
    accent === "lime" ? "bg-neon-lime shadow-glow-lime" : accent === "red" ? "bg-neon-red shadow-glow-red" : "bg-neon-cyan shadow-glow-cyan";
  return (
    <div className="rounded-md border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="mb-1.5 flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-fg-muted">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {title}
      </div>
      <p className="whitespace-pre-wrap text-sm text-fg-secondary">
        {value || <span className="text-fg-subtle">-</span>}
      </p>
    </div>
  );
}
