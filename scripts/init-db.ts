import { getDb } from "../lib/db";

const db = getDb();

const existing = db.prepare("SELECT COUNT(*) as c FROM tier_a_targets").get() as { c: number };
if (existing.c === 0) {
  const insert = db.prepare(
    `INSERT INTO tier_a_targets (brand_name, founder_name, instagram_handle, linkedin_url, email, status, last_contacted, expected_deal_value_aud, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (let i = 1; i <= 10; i++) {
    insert.run(`Brand ${i}`, "", "", "", "", "cold", "", 0, "");
  }
  console.log("Seeded 10 placeholder Tier A targets.");
} else {
  console.log(`Tier A table already has ${existing.c} rows — skipping seed.`);
}

const weeklyCount = db.prepare("SELECT COUNT(*) as c FROM weekly_entries").get() as { c: number };
console.log(`Weekly entries: ${weeklyCount.c}`);
console.log("DB initialized at data/sourci.db");
