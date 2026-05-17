export type SalesCyclePhase = "M1" | "M2" | "M3" | "steady";

export interface PhaseInfo {
  phase: SalesCyclePhase;
  label: string;
  shortLabel: string;
  index: 0 | 1 | 2 | 3;
  daysIn: number;
  daysUntilNext: number | null;
  nextLabel: string | null;
}

export const PHASE_LENGTH_DAYS = 35;
export const PHASE_LABELS: Record<SalesCyclePhase, { full: string; short: string }> = {
  M1: { full: "Month 1 (wk 4)", short: "M1" },
  M2: { full: "Month 2", short: "M2" },
  M3: { full: "Month 3", short: "M3" },
  steady: { full: "Steady state", short: "Steady" },
};

export const PHASE_COLUMN_HEADERS = ["M1 (wk 4)", "M2", "M3", "Steady state"] as const;

export type TargetCadence = "wk" | "mo" | "mo_state" | "mo_value";

export interface WeeklyTargetEntry {
  fieldKey: string;
  cadence: TargetCadence;
  values: [string, string, string, string];
}

/** Per-form-field target hints used on the submit page. */
export const WEEKLY_TARGET_TABLE: WeeklyTargetEntry[] = [
  { fieldKey: "new_prospects_added",       cadence: "wk",       values: ["75/wk", "50/wk", "40–50/wk", "~38/wk"] },
  { fieldKey: "discovery_calls_completed", cadence: "wk",       values: ["2–3",   "5–6",   "6–8",       "8–10"] },
  { fieldKey: "proposals_issued",          cadence: "mo",       values: ["0",     "3–5",   "5–7",       "6–8"] },
  { fieldKey: "sample_programs_active",    cadence: "mo_state", values: ["0",     "1–2",   "3–5",       "4–6"] },
  { fieldKey: "production_pos_signed",     cadence: "mo",       values: ["0",     "0–1",   "1–2",       "2–3"] },
  { fieldKey: "pipeline_value_aud",        cadence: "mo_value", values: ["$0–300k", "$1–1.5M", "$2M+",   "$2.5M+"] },
];

export const OUTBOUND_TOUCHES_TARGETS: [string, string, string, string] = ["100/wk", "100/wk", "100+/wk", "100+/wk"];

/** Reference tables for /targets — full sales-cycle ladder, including derived metrics. */
export interface PhaseRow {
  label: string;
  values: [string, string, string, string];
}

export const WEEKLY_PHASE_TABLE: PhaseRow[] = [
  { label: "Prospects added to CRM",                  values: ["75/wk", "50/wk", "40–50/wk", "~38/wk"] },
  { label: "Outbound touches sent",                   values: ["100",   "100",   "100+",     "100+"] },
  { label: "Positive replies / conversations opened", values: ["5–8",   "8–10",  "9–11",     "10–13"] },
  { label: "Discovery calls booked",                  values: ["3–5",   "8–10",  "8–10",     "~11"] },
  { label: "Discovery Calls/Meetings (north ★)",      values: ["2–3",   "5–6",   "6–8",      "8–10"] },
];

export const MONTHLY_PHASE_TABLE: PhaseRow[] = [
  { label: "Qualified opportunities created ($300k+)", values: ["0–1",     "3–5",      "5–7",   "6–8"] },
  { label: "Quotes / proposals issued",                values: ["0",       "3–5",      "5–7",   "6–8"] },
  { label: "Sample programs in production",            values: ["0",       "1–2",      "3–5",   "4–6"] },
  { label: "Signed deals (first PO)",                  values: ["0",       "0–1",      "1–2",   "2–3"] },
  { label: "Qualified pipeline value added",           values: ["$0–300k", "$1–1.5M",  "$2M+",  "$2.5M+"] },
];

export function cadenceSuffix(c: TargetCadence): string {
  if (c === "wk") return "/wk";
  if (c === "mo") return "/mo";
  if (c === "mo_state") return " end of month";
  if (c === "mo_value") return " / mo added";
  return "";
}

export function targetForFieldAtPhase(fieldKey: string, phaseIndex: 0 | 1 | 2 | 3) {
  const entry = WEEKLY_TARGET_TABLE.find((e) => e.fieldKey === fieldKey);
  if (!entry) return null;
  return { entry, value: entry.values[phaseIndex] };
}

/** Parse a value string ("75/wk", "40–50/wk", "2–3", "100+", "~38/wk") to a midpoint number. */
function parseValueToNumber(v: string): number | null {
  const cleaned = v.replace(/\/(wk|mo)|\+|~|\$|k|M/g, "").trim();
  const range = cleaned.match(/^(\d+(?:\.\d+)?)\s*[–-]\s*(\d+(?:\.\d+)?)$/);
  if (range) return (parseFloat(range[1]) + parseFloat(range[2])) / 2;
  const num = parseFloat(cleaned);
  return isNaN(num) ? null : num;
}

/** Numeric weekly target for the activity chart (null if metric isn't on a weekly cadence). */
export function weeklyTargetNumeric(fieldKey: string, phaseIndex: 0 | 1 | 2 | 3): number | null {
  const entry = WEEKLY_TARGET_TABLE.find((e) => e.fieldKey === fieldKey);
  if (!entry || entry.cadence !== "wk") return null;
  return parseValueToNumber(entry.values[phaseIndex]);
}

/** Combined outbound touches numeric (split evenly across email + linkedin channels). */
export function outboundChannelTargetNumeric(phaseIndex: 0 | 1 | 2 | 3): number | null {
  const v = OUTBOUND_TOUCHES_TARGETS[phaseIndex];
  const total = parseValueToNumber(v);
  return total === null ? null : Math.round(total / 2);
}
