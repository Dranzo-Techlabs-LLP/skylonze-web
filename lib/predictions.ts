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
