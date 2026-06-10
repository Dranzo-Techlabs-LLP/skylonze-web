import { pool, query } from "./db";

export type SiteSettings = Record<string, string>;

export async function getAllSettings(): Promise<SiteSettings> {
  const rows = await query<{ k: string; v: string }>("SELECT k, v FROM site_settings");
  const out: SiteSettings = {};
  for (const r of rows) out[r.k] = r.v;
  return out;
}

export async function setSetting(k: string, v: string | null) {
  if (v === null || v === "") {
    await pool.query("DELETE FROM site_settings WHERE k=?", [k]);
  } else {
    await pool.query(
      "INSERT INTO site_settings (k, v) VALUES (?, ?) ON DUPLICATE KEY UPDATE v=VALUES(v)",
      [k, v],
    );
  }
}

/** Allowed adjustment keys for homepage stats (added to live values). */
export const STAT_KEYS = [
  "volume",
  "activeMarkets",
  "users",
  "predictors",
  "startups",
  "resolved",
  "winRate",
] as const;
export type StatKey = (typeof STAT_KEYS)[number];

/** USD value of 1 SKY for the converter (admin-adjustable; default 0.01). */
export const CONVERTER_RATE_KEY = "converter.rate";
export const DEFAULT_CONVERTER_RATE = 0.01;

export async function getConverterRate(): Promise<number> {
  const settings = await getAllSettings();
  const n = Number(settings[CONVERTER_RATE_KEY]);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_CONVERTER_RATE;
}
