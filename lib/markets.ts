import { pool, query, queryOne } from "./db";
import type { Market } from "./data";

type Row = {
  id: string;
  category: string;
  title: string;
  question: string;
  closes: string;
  yes: number;
  volume: number;
  participants: number;
  hot: number;
  trend: string | null;
  sort_order: number;
};

function toMarket(r: Row): Market {
  return {
    id: r.id,
    category: r.category as Market["category"],
    title: r.title,
    question: r.question,
    closes: r.closes,
    yes: Number(r.yes),
    volume: Number(r.volume),
    participants: Number(r.participants),
    hot: !!r.hot,
    trend: (r.trend ?? "").split(",").filter(Boolean).map(Number),
  };
}

export async function listMarkets(): Promise<Market[]> {
  const rows = await query<Row>("SELECT * FROM markets ORDER BY sort_order ASC, created_at ASC");
  return rows.map(toMarket);
}

export async function getMarket(id: string): Promise<Market | null> {
  const r = await queryOne<Row>("SELECT * FROM markets WHERE id=?", [id]);
  return r ? toMarket(r) : null;
}

export async function getAllMarketIds(): Promise<string[]> {
  const rows = await query<{ id: string }>("SELECT id FROM markets");
  return rows.map((r) => r.id);
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 56);
}

export async function createMarket(m: Omit<Market, "trend"> & { trend?: number[] }) {
  const id = m.id?.trim() ? slugify(m.id) : `${slugify(m.title)}-${Math.random().toString(36).slice(2, 6)}`;
  const trend = (m.trend && m.trend.length ? m.trend : defaultTrend(m.yes)).join(",");
  const [maxRow]: any = await pool.query("SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM markets");
  await pool.query(
    "INSERT INTO markets (id,category,title,question,closes,yes,volume,participants,hot,trend,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [id, m.category, m.title, m.question, m.closes, m.yes, m.volume ?? 0, m.participants ?? 0, m.hot ? 1 : 0, trend, maxRow[0].n],
  );
  return getMarket(id);
}

export async function updateMarket(id: string, m: Partial<Market>) {
  const cur = await getMarket(id);
  if (!cur) throw new Error("Market not found.");
  const next = { ...cur, ...m };
  const trend = (next.trend && next.trend.length ? next.trend : defaultTrend(next.yes)).join(",");
  await pool.query(
    "UPDATE markets SET category=?, title=?, question=?, closes=?, yes=?, volume=?, participants=?, hot=?, trend=? WHERE id=?",
    [next.category, next.title, next.question, next.closes, next.yes, next.volume, next.participants, next.hot ? 1 : 0, trend, id],
  );
  return getMarket(id);
}

export async function deleteMarket(id: string) {
  await pool.query("DELETE FROM predictions WHERE market_id=?", [id]);
  await pool.query("DELETE FROM market_resolutions WHERE market_id=?", [id]);
  await pool.query("DELETE FROM markets WHERE id=?", [id]);
}

function defaultTrend(yes: number): number[] {
  const start = Math.max(5, Math.min(95, yes - 12));
  return Array.from({ length: 8 }, (_, i) => Math.round(start + (yes - start) * (i / 7)));
}
