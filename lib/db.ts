import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  const dbPath = path.join(dataDir, "sourci.db");
  db = new Database(dbPath);
  db.pragma("journal_mode = WAL");
  initSchema(db);
  return db;
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS weekly_entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      week_start_date TEXT NOT NULL,
      week_end_date TEXT NOT NULL,
      iso_year INTEGER NOT NULL,
      iso_week INTEGER NOT NULL,
      new_prospects_added INTEGER NOT NULL DEFAULT 0,
      cold_emails_sent INTEGER NOT NULL DEFAULT 0,
      linkedin_requests_sent INTEGER NOT NULL DEFAULT 0,
      tier_a_touches INTEGER NOT NULL DEFAULT 0,
      discovery_calls_completed INTEGER NOT NULL DEFAULT 0,
      proposals_issued INTEGER NOT NULL DEFAULT 0,
      engagements_signed INTEGER NOT NULL DEFAULT 0,
      sample_programs_active INTEGER NOT NULL DEFAULT 0,
      sample_spend_committed_aud REAL NOT NULL DEFAULT 0,
      production_pos_signed INTEGER NOT NULL DEFAULT 0,
      production_po_value_aud REAL NOT NULL DEFAULT 0,
      pipeline_value_aud REAL NOT NULL DEFAULT 0,
      whats_working TEXT DEFAULT '',
      whats_not TEXT DEFAULT '',
      ask_of_gio TEXT DEFAULT '',
      submitted_at TEXT NOT NULL,
      UNIQUE(iso_year, iso_week)
    );

    CREATE TABLE IF NOT EXISTS tier_a_targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      brand_name TEXT NOT NULL,
      founder_name TEXT DEFAULT '',
      instagram_handle TEXT DEFAULT '',
      linkedin_url TEXT DEFAULT '',
      email TEXT DEFAULT '',
      status TEXT NOT NULL DEFAULT 'cold',
      last_contacted TEXT DEFAULT '',
      expected_deal_value_aud REAL NOT NULL DEFAULT 0,
      notes TEXT DEFAULT ''
    );
  `);

  const tierACount = database.prepare("SELECT COUNT(*) as c FROM tier_a_targets").get() as { c: number };
  if (tierACount.c === 0) {
    const insert = database.prepare(
      `INSERT INTO tier_a_targets (brand_name, founder_name, instagram_handle, linkedin_url, email, status, last_contacted, expected_deal_value_aud, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    );
    for (let i = 1; i <= 10; i++) insert.run(`Brand ${i}`, "", "", "", "", "cold", "", 0, "");
  }
}

export type { WeeklyEntry } from "./weekly-shared";
import type { WeeklyEntry } from "./weekly-shared";

export { TIER_A_STATUSES } from "./tier-a-shared";
export type { TierATarget } from "./tier-a-shared";
import type { TierATarget } from "./tier-a-shared";

export function getAllWeeklyEntries(): WeeklyEntry[] {
  return getDb()
    .prepare("SELECT * FROM weekly_entries ORDER BY week_start_date DESC")
    .all() as WeeklyEntry[];
}

export function getWeeklyEntryByIsoWeek(year: number, week: number): WeeklyEntry | null {
  const row = getDb()
    .prepare("SELECT * FROM weekly_entries WHERE iso_year = ? AND iso_week = ?")
    .get(year, week) as WeeklyEntry | undefined;
  return row ?? null;
}

export function upsertWeeklyEntry(entry: Omit<WeeklyEntry, "id">): WeeklyEntry {
  const existing = getWeeklyEntryByIsoWeek(entry.iso_year, entry.iso_week);
  const stmt = existing
    ? getDb().prepare(
        `UPDATE weekly_entries SET
          week_start_date=@week_start_date, week_end_date=@week_end_date,
          new_prospects_added=@new_prospects_added, cold_emails_sent=@cold_emails_sent,
          linkedin_requests_sent=@linkedin_requests_sent, tier_a_touches=@tier_a_touches,
          discovery_calls_completed=@discovery_calls_completed, proposals_issued=@proposals_issued,
          engagements_signed=@engagements_signed, sample_programs_active=@sample_programs_active,
          sample_spend_committed_aud=@sample_spend_committed_aud, production_pos_signed=@production_pos_signed,
          production_po_value_aud=@production_po_value_aud, pipeline_value_aud=@pipeline_value_aud,
          whats_working=@whats_working, whats_not=@whats_not, ask_of_gio=@ask_of_gio,
          submitted_at=@submitted_at
        WHERE iso_year=@iso_year AND iso_week=@iso_week`
      )
    : getDb().prepare(
        `INSERT INTO weekly_entries (
          week_start_date, week_end_date, iso_year, iso_week,
          new_prospects_added, cold_emails_sent, linkedin_requests_sent, tier_a_touches,
          discovery_calls_completed, proposals_issued, engagements_signed, sample_programs_active,
          sample_spend_committed_aud, production_pos_signed, production_po_value_aud, pipeline_value_aud,
          whats_working, whats_not, ask_of_gio, submitted_at
        ) VALUES (
          @week_start_date, @week_end_date, @iso_year, @iso_week,
          @new_prospects_added, @cold_emails_sent, @linkedin_requests_sent, @tier_a_touches,
          @discovery_calls_completed, @proposals_issued, @engagements_signed, @sample_programs_active,
          @sample_spend_committed_aud, @production_pos_signed, @production_po_value_aud, @pipeline_value_aud,
          @whats_working, @whats_not, @ask_of_gio, @submitted_at
        )`
      );
  stmt.run(entry);
  return getWeeklyEntryByIsoWeek(entry.iso_year, entry.iso_week)!;
}

export function getAllTierA(): TierATarget[] {
  return getDb().prepare("SELECT * FROM tier_a_targets ORDER BY id ASC").all() as TierATarget[];
}

export function createTierA(t: Omit<TierATarget, "id">): TierATarget {
  const stmt = getDb().prepare(
    `INSERT INTO tier_a_targets (brand_name, founder_name, instagram_handle, linkedin_url, email, status, last_contacted, expected_deal_value_aud, notes)
     VALUES (@brand_name, @founder_name, @instagram_handle, @linkedin_url, @email, @status, @last_contacted, @expected_deal_value_aud, @notes)`
  );
  const result = stmt.run(t);
  return getDb().prepare("SELECT * FROM tier_a_targets WHERE id = ?").get(result.lastInsertRowid) as TierATarget;
}

export function updateTierA(id: number, t: Omit<TierATarget, "id">): TierATarget | null {
  getDb()
    .prepare(
      `UPDATE tier_a_targets SET
        brand_name=@brand_name, founder_name=@founder_name, instagram_handle=@instagram_handle,
        linkedin_url=@linkedin_url, email=@email, status=@status, last_contacted=@last_contacted,
        expected_deal_value_aud=@expected_deal_value_aud, notes=@notes
       WHERE id=@id`
    )
    .run({ ...t, id });
  return (getDb().prepare("SELECT * FROM tier_a_targets WHERE id = ?").get(id) as TierATarget) ?? null;
}

export function deleteTierA(id: number): void {
  getDb().prepare("DELETE FROM tier_a_targets WHERE id = ?").run(id);
}
