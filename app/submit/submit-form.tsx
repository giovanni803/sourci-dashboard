"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { WeeklyEntry } from "@/lib/weekly-shared";
import {
  OUTBOUND_TOUCHES_TARGETS,
  PhaseInfo,
  cadenceSuffix,
  targetForFieldAtPhase,
} from "@/lib/sales-cycle-data";
import { cn } from "@/lib/utils";

type Bounds = {
  weekStart: string;
  weekEnd: string;
  isoYear: number;
  isoWeek: number;
};

const numericFields = [
  { key: "new_prospects_added", label: "New prospects added", group: "activity" },
  { key: "cold_emails_sent", label: "Cold emails sent", group: "activity" },
  { key: "linkedin_requests_sent", label: "LinkedIn requests sent", group: "activity" },
  { key: "tier_a_touches", label: "Tier A touches", group: "activity" },
  { key: "discovery_calls_completed", label: "Discovery Calls/Meetings", group: "activity" },
  { key: "proposals_issued", label: "Proposals issued", group: "pipeline" },
  { key: "engagements_signed", label: "Engagements signed (sample agreements)", group: "pipeline" },
  { key: "sample_programs_active", label: "Active sample programs (end of week)", group: "pipeline" },
  { key: "sample_spend_committed_aud", label: "Sample spend committed (AUD, cumulative)", group: "pipeline", currency: true },
  { key: "pipeline_value_aud", label: "Total qualified pipeline (AUD)", group: "pipeline", currency: true },
  { key: "production_pos_signed", label: "Production POs signed", group: "outcomes" },
  { key: "production_po_value_aud", label: "Production PO value (AUD)", group: "outcomes", currency: true },
] as const;

export function SubmitForm({
  bounds,
  initial,
  phase,
}: {
  bounds: Bounds;
  initial: WeeklyEntry | null;
  phase: PhaseInfo;
}) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const f of numericFields) {
      base[f.key] = initial ? String((initial as unknown as Record<string, number>)[f.key] ?? 0) : "0";
    }
    base.whats_working = initial?.whats_working ?? "";
    base.whats_not = initial?.whats_not ?? "";
    base.ask_of_gio = initial?.ask_of_gio ?? "";
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState<string | null>(null);

  function update(key: string, value: string) {
    setState((s) => ({ ...s, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSavedMsg(null);
    const payload: Record<string, unknown> = {
      week_start_date: bounds.weekStart,
      week_end_date: bounds.weekEnd,
      iso_year: bounds.isoYear,
      iso_week: bounds.isoWeek,
      whats_working: state.whats_working,
      whats_not: state.whats_not,
      ask_of_gio: state.ask_of_gio,
    };
    for (const f of numericFields) payload[f.key] = Number(state[f.key]) || 0;

    const res = await fetch("/api/weekly", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (res.ok) {
      setSavedMsg("Saved.");
      setTimeout(() => router.push("/"), 600);
      router.refresh();
    } else {
      setSavedMsg("Save failed - please try again.");
    }
  }

  const sections = [
    { id: "activity", title: "Activity" },
    { id: "pipeline", title: "Pipeline" },
    { id: "outcomes", title: "Outcomes" },
  ] as const;

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <PhaseBanner phase={phase} />

      {sections.map((sec) => (
        <section key={sec.id}>
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-neon-cyan/80">
              {sec.title}
            </h3>
            {sec.id === "activity" && (
              <span className="text-[11px] text-fg-muted">
                Outbound touches (combined): <span className="text-fg-secondary">{OUTBOUND_TOUCHES_TARGETS[phase.index]}</span>
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {numericFields
              .filter((f) => f.group === sec.id)
              .map((f) => {
                const t = targetForFieldAtPhase(f.key, phase.index);
                return (
                  <div key={f.key} className="space-y-1.5">
                    <Label htmlFor={f.key}>{f.label}</Label>
                    <div className="relative">
                      {"currency" in f && f.currency && (
                        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-fg-muted">
                          A$
                        </span>
                      )}
                      <Input
                        id={f.key}
                        type="number"
                        min="0"
                        step={"currency" in f && f.currency ? "0.01" : "1"}
                        inputMode="decimal"
                        className={cn("currency" in f && f.currency ? "pl-9" : "", t && "pr-2")}
                        value={state[f.key]}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => update(f.key, e.target.value)}
                      />
                    </div>
                    {t && (
                      <p className="text-[11px] text-fg-muted">
                        <span className="text-fg-subtle">{phase.shortLabel} target </span>
                        <span className="font-medium text-neon-cyan/90">{t.value}</span>
                        {t.entry.cadence !== "wk" && !t.value.includes("/") && (
                          <span className="text-fg-subtle">{cadenceSuffix(t.entry.cadence)}</span>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        </section>
      ))}

      <section>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] text-neon-cyan/80">Notes</h3>
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="whats_working">What's working</Label>
            <Textarea
              id="whats_working"
              value={state.whats_working}
              onChange={(e) => update("whats_working", e.target.value)}
              placeholder="Wins, channels, messaging that's landing…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whats_not">What's not</Label>
            <Textarea
              id="whats_not"
              value={state.whats_not}
              onChange={(e) => update("whats_not", e.target.value)}
              placeholder="Friction, blockers, dead ends…"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ask_of_gio">Ask of Gio</Label>
            <Textarea
              id="ask_of_gio"
              value={state.ask_of_gio}
              onChange={(e) => update("ask_of_gio", e.target.value)}
              placeholder="Intros, sign-offs, decisions needed…"
            />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-between border-t border-white/[0.06] pt-5">
        <p className="text-xs text-fg-muted">{savedMsg ?? "All numeric fields default to 0."}</p>
        <Button type="submit" disabled={saving}>
          {saving ? "Saving…" : initial ? "Update entry" : "Submit entry"}
        </Button>
      </div>
    </form>
  );
}

function PhaseBanner({ phase }: { phase: PhaseInfo }) {
  return (
    <div className="rounded-md border border-neon-cyan/20 bg-neon-cyan/[0.04] p-3.5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-neon-cyan">
            Currently
          </span>
          <span className="text-sm font-semibold tracking-tight text-fg-primary">{phase.label}</span>
        </div>
        <span className="text-[11px] text-fg-muted">
          {phase.daysUntilNext !== null && phase.nextLabel ? (
            <>
              {phase.daysUntilNext === 0
                ? `Moves to ${phase.nextLabel} tomorrow`
                : `${phase.daysUntilNext} day${phase.daysUntilNext === 1 ? "" : "s"} until ${phase.nextLabel}`}
            </>
          ) : (
            <>Targets shown reflect long-term steady state</>
          )}
        </span>
      </div>
      <p className="mt-1 text-[11px] text-fg-muted">
        Targets next to each field below reflect the current phase. The form rolls forward automatically every 35 days.
      </p>
    </div>
  );
}
