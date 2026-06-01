import { pool, query } from "./db";
import { getStartup } from "./startups";

export type Investment = {
  id: number;
  user_id: number;
  startup_id: string;
  startup_name: string;
  amount: number;
  created_at: string;
};

export const MIN_INVEST = 50;

/**
 * Back a startup with SKY. Validates the startup + balance, debits the stake,
 * records a wallet transaction + investment row, and grows the startup's
 * raised total — all atomically.
 */
export async function investInStartup(opts: {
  userId: number;
  startupId: string;
  amount: number;
}): Promise<{ investment: Investment; balance: number; raised: number }> {
  const startup = await getStartup(opts.startupId);
  if (!startup) throw new Error("Startup not found.");

  const amount = Math.floor(opts.amount);
  if (!amount || amount < MIN_INVEST) throw new Error(`Minimum backing is ${MIN_INVEST} SKY.`);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query("SELECT sky_balance FROM users WHERE id=? FOR UPDATE", [opts.userId]);
    if (!rows.length) throw new Error("User not found.");
    const balance = Number(rows[0].sky_balance);
    if (balance < amount) throw new Error("Insufficient SKY balance.");

    const next = balance - amount;
    await conn.query("UPDATE users SET sky_balance=? WHERE id=?", [next, opts.userId]);
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
      [opts.userId, "debit", amount, next, `Backed startup · ${startup.name}`],
    );
    const [res]: any = await conn.query(
      "INSERT INTO startup_investments (user_id, startup_id, startup_name, amount) VALUES (?,?,?,?)",
      [opts.userId, startup.id, startup.name, amount],
    );
    await conn.query("UPDATE startups SET raised = raised + ? WHERE id=?", [amount, startup.id]);
    const [rs]: any = await conn.query("SELECT raised FROM startups WHERE id=?", [startup.id]);
    await conn.commit();

    const [inv]: any = await conn.query("SELECT * FROM startup_investments WHERE id=?", [res.insertId]);
    return { investment: inv[0] as Investment, balance: next, raised: Number(rs[0].raised) };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

/** Total SKY a user has put into a given startup. */
export async function userStartupTotal(userId: number, startupId: string): Promise<number> {
  const rows = await query<{ total: number }>(
    "SELECT COALESCE(SUM(amount),0) total FROM startup_investments WHERE user_id=? AND startup_id=?",
    [userId, startupId],
  );
  return Number(rows[0]?.total ?? 0);
}

/** A user's investments across all startups (most recent first). */
export async function listUserInvestments(userId: number, limit = 100): Promise<Investment[]> {
  return query<Investment>(
    "SELECT * FROM startup_investments WHERE user_id=? ORDER BY id DESC LIMIT ?",
    [userId, limit],
  );
}
