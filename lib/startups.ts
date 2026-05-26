import { pool, query, queryOne } from "./db";
import type { Startup } from "./data";

type Row = {
  id: string;
  name: string;
  pitch: string;
  sector: string;
  raised: number;
  valuation: number;
  growth: number;
  founders: string | null;
  logo_seed: string | null;
  logo_url: string | null;
  sort_order: number;
};

function toStartup(r: Row): Startup {
  return {
    id: r.id,
    name: r.name,
    pitch: r.pitch,
    sector: r.sector,
    raised: Number(r.raised),
    valuation: Number(r.valuation),
    growth: Number(r.growth),
    founders: r.founders ?? "",
    logoSeed: r.logo_seed ?? r.id,
    logoUrl: r.logo_url ?? null,
  };
}

export async function listStartups(): Promise<Startup[]> {
  const rows = await query<Row>("SELECT * FROM startups ORDER BY sort_order ASC, created_at ASC");
  return rows.map(toStartup);
}

export async function getStartup(id: string): Promise<Startup | null> {
  const r = await queryOne<Row>("SELECT * FROM startups WHERE id=?", [id]);
  return r ? toStartup(r) : null;
}

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 56);
}

export async function createStartup(s: Omit<Startup, "id" | "logoSeed" | "logoUrl"> & { id?: string; logoSeed?: string; logoUrl?: string | null }) {
  const id = s.id?.trim() ? slugify(s.id) : `${slugify(s.name)}-${Math.random().toString(36).slice(2, 6)}`;
  const [maxRow]: any = await pool.query("SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM startups");
  await pool.query(
    "INSERT INTO startups (id,name,pitch,sector,raised,valuation,growth,founders,logo_seed,logo_url,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
    [id, s.name, s.pitch, s.sector, s.raised ?? 0, s.valuation ?? 0, s.growth ?? 0, s.founders ?? "", s.logoSeed ?? id, s.logoUrl ?? null, maxRow[0].n],
  );
  return getStartup(id);
}

export async function updateStartup(id: string, s: Partial<Startup>) {
  const cur = await getStartup(id);
  if (!cur) throw new Error("Startup not found.");
  const next = { ...cur, ...s };
  await pool.query(
    "UPDATE startups SET name=?, pitch=?, sector=?, raised=?, valuation=?, growth=?, founders=?, logo_seed=?, logo_url=? WHERE id=?",
    [next.name, next.pitch, next.sector, next.raised, next.valuation, next.growth, next.founders, next.logoSeed, next.logoUrl ?? null, id],
  );
  return getStartup(id);
}

export async function deleteStartup(id: string) {
  await pool.query("DELETE FROM startups WHERE id=?", [id]);
}
