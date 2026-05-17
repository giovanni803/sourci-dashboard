import fs from "fs";
import path from "path";

const CONFIG_PATH = path.join(process.cwd(), "data", "config.json");

export interface AppConfig {
  startMonth: string;          // YYYY-MM — anchor for quarter boundaries
  salesCycleStart?: string;    // YYYY-MM-DD — anchor for M1/M2/M3/steady (35-day windows)
}

function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function defaultConfig(): AppConfig {
  const now = new Date();
  return {
    startMonth: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`,
    salesCycleStart: todayIso(),
  };
}

function writeConfig(cfg: AppConfig) {
  fs.mkdirSync(path.dirname(CONFIG_PATH), { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

export function getConfig(): AppConfig {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      const cfg = defaultConfig();
      writeConfig(cfg);
      return cfg;
    }
    const cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8")) as AppConfig;
    if (!cfg.salesCycleStart) {
      cfg.salesCycleStart = todayIso();
      try { writeConfig(cfg); } catch { /* ignore write failure */ }
    }
    return cfg;
  } catch {
    return defaultConfig();
  }
}

export function getStartDate(): Date {
  const cfg = getConfig();
  const [year, month] = cfg.startMonth.split("-").map(Number);
  const d = new Date(year, month - 1, 1);
  const day = d.getDay();
  const diff = day === 0 ? 1 : day === 1 ? 0 : 8 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

export function getSalesCycleStartDate(): Date {
  const cfg = getConfig();
  if (cfg.salesCycleStart) {
    const [y, m, d] = cfg.salesCycleStart.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  return new Date();
}
