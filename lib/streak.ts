import { pool } from "./db";

/** Daily streak bonus schedule. Day 7+ keeps paying the day-7 amount. */
export const STREAK_REWARDS = [50, 75, 120, 180, 260, 360, 600];

function dayString(d: Date): string {
  // Server-local calendar date, YYYY-MM-DD
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Award the daily login streak bonus, at most once per calendar day.
 * Consecutive days extend the streak; a missed day resets it to 1.
 * Only verified users earn the bonus. Atomic; safe to call on every
 * authenticated request (no-ops when already claimed today).
 *
 * Returns the awarded amount + streak day when a bonus was granted,
 * or null when nothing changed.
 */
export async function touchStreak(userId: number): Promise<{ amount: number; day: number } | null> {
  const today = dayString(new Date());
  const yesterday = dayString(new Date(Date.now() - 86_400_000));

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query(
      "SELECT sky_balance, streak_count, last_streak_at, email_verified, role, status FROM users WHERE id=? FOR UPDATE",
      [userId],
    );
    if (!rows.length) { await conn.rollback(); return null; }
    const u = rows[0];

    // Only active, verified, regular users participate.
    if (u.role !== "user" || u.status !== "active" || !u.email_verified) {
      await conn.rollback();
      return null;
    }

    const last = u.last_streak_at ? dayString(new Date(u.last_streak_at)) : null;
    if (last === today) { await conn.rollback(); return null; } // already claimed

    const day = last === yesterday ? Number(u.streak_count) + 1 : 1;
    const amount = STREAK_REWARDS[Math.min(day, STREAK_REWARDS.length) - 1];
    const next = Number(u.sky_balance) + amount;

    await conn.query(
      "UPDATE users SET streak_count=?, last_streak_at=?, sky_balance=? WHERE id=?",
      [day, today, next, userId],
    );
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
      [userId, "credit", amount, next, `Daily login streak · Day ${day}`],
    );
    await conn.commit();
    return { amount, day };
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}
