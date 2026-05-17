export interface WeeklyEntry {
  id: number;
  week_start_date: string;
  week_end_date: string;
  iso_year: number;
  iso_week: number;
  new_prospects_added: number;
  cold_emails_sent: number;
  linkedin_requests_sent: number;
  tier_a_touches: number;
  discovery_calls_completed: number;
  proposals_issued: number;
  engagements_signed: number;
  sample_programs_active: number;
  sample_spend_committed_aud: number;
  production_pos_signed: number;
  production_po_value_aud: number;
  pipeline_value_aud: number;
  whats_working: string;
  whats_not: string;
  ask_of_gio: string;
  submitted_at: string;
}
