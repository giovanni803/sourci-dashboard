import { NextResponse } from "next/server";
import { getAllWeeklyEntries, upsertWeeklyEntry } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getAllWeeklyEntries());
}

export async function POST(req: Request) {
  const body = await req.json();
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v) || 0);
  const entry = {
    week_start_date: String(body.week_start_date),
    week_end_date: String(body.week_end_date),
    iso_year: num(body.iso_year),
    iso_week: num(body.iso_week),
    new_prospects_added: num(body.new_prospects_added),
    cold_emails_sent: num(body.cold_emails_sent),
    linkedin_requests_sent: num(body.linkedin_requests_sent),
    tier_a_touches: num(body.tier_a_touches),
    discovery_calls_completed: num(body.discovery_calls_completed),
    proposals_issued: num(body.proposals_issued),
    engagements_signed: num(body.engagements_signed),
    sample_programs_active: num(body.sample_programs_active),
    sample_spend_committed_aud: num(body.sample_spend_committed_aud),
    production_pos_signed: num(body.production_pos_signed),
    production_po_value_aud: num(body.production_po_value_aud),
    pipeline_value_aud: num(body.pipeline_value_aud),
    whats_working: String(body.whats_working ?? ""),
    whats_not: String(body.whats_not ?? ""),
    ask_of_gio: String(body.ask_of_gio ?? ""),
    submitted_at: new Date().toISOString(),
  };
  const saved = upsertWeeklyEntry(entry);
  return NextResponse.json(saved);
}
