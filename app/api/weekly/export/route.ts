import { getAllWeeklyEntries } from "@/lib/db";

const columns = [
  "week_start_date",
  "week_end_date",
  "iso_year",
  "iso_week",
  "new_prospects_added",
  "cold_emails_sent",
  "linkedin_requests_sent",
  "tier_a_touches",
  "discovery_calls_completed",
  "proposals_issued",
  "engagements_signed",
  "sample_programs_active",
  "sample_spend_committed_aud",
  "production_pos_signed",
  "production_po_value_aud",
  "pipeline_value_aud",
  "whats_working",
  "whats_not",
  "ask_of_gio",
  "submitted_at",
] as const;

function csvEscape(v: unknown): string {
  const s = String(v ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const rows = getAllWeeklyEntries();
  const header = columns.join(",");
  const body = rows
    .slice()
    .reverse()
    .map((r) => columns.map((c) => csvEscape((r as unknown as Record<string, unknown>)[c])).join(","))
    .join("\n");
  const csv = `${header}\n${body}`;
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="sourci-weekly-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
