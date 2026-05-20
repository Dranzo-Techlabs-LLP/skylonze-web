import { pool, query } from "./db";
import { markets } from "./data";

export type Prediction = {
  id: number;
  user_id: number;
  market_id: string;
  market_title: string;
  category: string;
  side: "YES" | "NO";
  stake: number;
  entry_prob: number;
  potential_payout: number;
  status: "open" | "won" | "lost";
  created_at: string;
};

/** Place a prediction: validates market + balance, debits stake, records position — atomically. */
export async function placePrediction(opts: {
  userId: number;
  marketId: string;
  side: "YES" | "NO";
  stake: number;
}): Promise<{ prediction: Prediction; balance: number }> {
  const market = markets.find((m) => m.id === opts.marketId);
  if (!market) throw new Error("Market not found.");
  const stake = Math.floor(opts.stake);
  if (!stake || stake < 10) throw new Error("Minimum stake is 10 SKY.");
  if (opts.side !== "YES" && opts.side !== "NO") throw new Error("Invalid side.");

  // Server-computed odds — never trust the client.
  const prob = opts.side === "YES" ? market.yes : 100 - market.yes;
  const safeProb = Math.min(99, Math.max(1, prob));
  const odds = 100 / safeProb;
  const payout = Math.round(stake * odds);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query("SELECT sky_balance FROM users WHERE id=? FOR UPDATE", [opts.userId]);
    if (!rows.length) throw new Error("User not found.");
    const balance = Number(rows[0].sky_balance);
    if (balance < stake) throw new Error("Insufficient SKY balance.");

    const next = balance - stake;
    await conn.query("UPDATE users SET sky_balance=? WHERE id=?", [next, opts.userId]);
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
      [opts.userId, "debit", stake, next, `Stake · ${market.title} (${opts.side})`],
    );
    const [res]: any = await conn.query(
      `INSERT INTO predictions (user_id, market_id, market_title, category, side, stake, entry_prob, potential_payout)
       VALUES (?,?,?,?,?,?,?,?)`,
      [opts.userId, market.id, market.title, market.category, opts.side, stake, safeProb, payout],
    );
    await conn.commit();

    const [pr]: any = await conn.query("SELECT * FROM predictions WHERE id=?", [res.insertId]);
    return { prediction: pr[0] as Prediction, balance: next };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function listPredictions(userId: number, limit = 100): Promise<Prediction[]> {
  return query<Prediction>(
    "SELECT * FROM predictions WHERE user_id=? ORDER BY id DESC LIMIT ?",
    [userId, limit],
  );
}

export async function predictionSummary(userId: number) {
  const rows = await query<{ c: number; staked: number; payout: number }>(
    "SELECT COUNT(*) c, COALESCE(SUM(stake),0) staked, COALESCE(SUM(potential_payout),0) payout FROM predictions WHERE user_id=? AND status='open'",
    [userId],
  );
  const r = rows[0] ?? { c: 0, staked: 0, payout: 0 };
  return { open: Number(r.c), staked: Number(r.staked), potential: Number(r.payout) };
}

export type Resolution = {
  market_id: string;
  outcome: "YES" | "NO";
  won_count: number;
  lost_count: number;
  paid_out: number;
  resolved_at: string;
};

export async function getResolution(marketId: string): Promise<Resolution | null> {
  const rows = await query<Resolution>("SELECT * FROM market_resolutions WHERE market_id=?", [marketId]);
  return rows[0] ?? null;
}

export async function listResolutions(): Promise<Resolution[]> {
  return query<Resolution>("SELECT * FROM market_resolutions");
}

/**
 * Resolve a market to an outcome. Settles all OPEN predictions:
 * winners (side === outcome) get credited their potential_payout; losers are
 * marked lost (stake was already debited at placement). Idempotent-guarded:
 * throws if the market was already resolved.
 */
export async function resolveMarket(marketId: string, outcome: "YES" | "NO", adminId: number) {
  const market = markets.find((m) => m.id === marketId);
  if (!market) throw new Error("Market not found.");
  if (outcome !== "YES" && outcome !== "NO") throw new Error("Invalid outcome.");

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing]: any = await conn.query("SELECT market_id FROM market_resolutions WHERE market_id=? FOR UPDATE", [marketId]);
    if (existing.length) throw new Error("Market already resolved.");

    const [open]: any = await conn.query(
      "SELECT id, user_id, side, stake, potential_payout FROM predictions WHERE market_id=? AND status='open' FOR UPDATE",
      [marketId],
    );

    let won = 0, lost = 0, paid = 0;
    for (const p of open) {
      if (p.side === outcome) {
        // winner: credit payout
        const [u]: any = await conn.query("SELECT sky_balance FROM users WHERE id=? FOR UPDATE", [p.user_id]);
        const bal = Number(u[0].sky_balance);
        const next = bal + Number(p.potential_payout);
        await conn.query("UPDATE users SET sky_balance=? WHERE id=?", [next, p.user_id]);
        await conn.query(
          "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
          [p.user_id, "credit", p.potential_payout, next, `Payout · ${market.title} (${outcome})`],
        );
        await conn.query("UPDATE predictions SET status='won', settled_at=NOW() WHERE id=?", [p.id]);
        won++; paid += Number(p.potential_payout);
      } else {
        await conn.query("UPDATE predictions SET status='lost', settled_at=NOW() WHERE id=?", [p.id]);
        lost++;
      }
    }

    await conn.query(
      "INSERT INTO market_resolutions (market_id, outcome, resolved_by, won_count, lost_count, paid_out) VALUES (?,?,?,?,?,?)",
      [marketId, outcome, adminId, won, lost, paid],
    );
    await conn.commit();
    return { won, lost, paid, settled: open.length };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/** Per-market open prediction counts (for admin market list). */
export async function openCountsByMarket(): Promise<Record<string, { open: number; staked: number }>> {
  const rows = await query<{ market_id: string; c: number; staked: number }>(
    "SELECT market_id, COUNT(*) c, COALESCE(SUM(stake),0) staked FROM predictions WHERE status='open' GROUP BY market_id",
  );
  const map: Record<string, { open: number; staked: number }> = {};
  for (const r of rows) map[r.market_id] = { open: Number(r.c), staked: Number(r.staked) };
  return map;
}
