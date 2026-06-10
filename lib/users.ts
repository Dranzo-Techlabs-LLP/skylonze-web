import bcrypt from "bcryptjs";
import { pool, query, queryOne } from "./db";

export type DbUser = {
  id: number;
  name: string;
  handle: string;
  email: string;
  password_hash: string;
  role: "user" | "admin";
  sky_balance: number;
  status: "active" | "suspended";
  avatar_seed: string | null;
  avatar_url: string | null;
  email_verified: number;
  bonus_granted: number;
  verify_token_hash: string | null;
  verify_expires: string | null;
  streak_count: number;
  last_streak_at: string | null;
  created_at: string;
};

export type PublicUser = Omit<DbUser, "password_hash" | "verify_token_hash" | "verify_expires">;

export function toPublic(u: DbUser): PublicUser {
  const { password_hash, verify_token_hash, verify_expires, ...rest } = u;
  return rest;
}

export async function findByEmail(email: string) {
  return queryOne<DbUser>("SELECT * FROM users WHERE email=? LIMIT 1", [email.toLowerCase()]);
}
export async function findByHandle(handle: string) {
  return queryOne<DbUser>("SELECT * FROM users WHERE handle=? LIMIT 1", [handle.toLowerCase()]);
}
export async function findById(id: number) {
  return queryOne<DbUser>("SELECT * FROM users WHERE id=? LIMIT 1", [id]);
}

/** Create an UNVERIFIED user (no bonus yet) with a hashed verification token. */
export async function createUser(opts: {
  name: string;
  handle: string;
  email: string;
  password: string;
  verifyTokenHash: string;
  verifyExpires: Date;
}): Promise<DbUser> {
  const hash = await bcrypt.hash(opts.password, 10);
  const [res]: any = await pool.query(
    `INSERT INTO users (name, handle, email, password_hash, role, sky_balance, avatar_seed,
       email_verified, bonus_granted, verify_token_hash, verify_expires)
     VALUES (?,?,?,?,?,?,?,0,0,?,?)`,
    [
      opts.name, opts.handle.toLowerCase(), opts.email.toLowerCase(), hash, "user", 0,
      opts.handle.toLowerCase(), opts.verifyTokenHash, opts.verifyExpires,
    ],
  );
  const user = await findById(res.insertId as number);
  return user as DbUser;
}

export async function setVerifyToken(userId: number, tokenHash: string, expires: Date) {
  await query("UPDATE users SET verify_token_hash=?, verify_expires=? WHERE id=?", [tokenHash, expires, userId]);
}

export async function findByVerifyToken(tokenHash: string): Promise<DbUser | null> {
  return queryOne<DbUser>(
    "SELECT * FROM users WHERE verify_token_hash=? AND verify_expires > NOW() LIMIT 1",
    [tokenHash],
  );
}

/** Mark verified; grant the signup bonus exactly once. Returns updated user. */
export async function verifyAndGrantBonus(userId: number, bonus: number): Promise<DbUser | null> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query("SELECT sky_balance, bonus_granted FROM users WHERE id=? FOR UPDATE", [userId]);
    if (!rows.length) throw new Error("User not found.");
    const grant = rows[0].bonus_granted ? 0 : bonus;
    const next = Number(rows[0].sky_balance) + grant;
    await conn.query(
      "UPDATE users SET email_verified=1, bonus_granted=1, verify_token_hash=NULL, verify_expires=NULL, sky_balance=? WHERE id=?",
      [next, userId],
    );
    if (grant > 0) {
      await conn.query(
        "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
        [userId, "credit", grant, next, "Welcome pack — starter SKY-3030"],
      );
    }
    await conn.commit();
    return findById(userId);
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function verifyPassword(user: DbUser, password: string) {
  return bcrypt.compare(password, user.password_hash);
}

export async function getTransactions(userId: number, limit = 50) {
  return query(
    "SELECT id, type, amount, balance_after, description, created_at FROM transactions WHERE user_id=? ORDER BY id DESC LIMIT ?",
    [userId, limit],
  );
}

/** Adjust balance atomically; records a transaction row. Positive = credit, negative = debit. */
export async function adjustBalance(userId: number, delta: number, description: string) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows]: any = await conn.query("SELECT sky_balance FROM users WHERE id=? FOR UPDATE", [userId]);
    if (!rows.length) throw new Error("User not found");
    const current = Number(rows[0].sky_balance);
    const next = current + delta;
    if (next < 0) throw new Error("Insufficient balance");
    await conn.query("UPDATE users SET sky_balance=? WHERE id=?", [next, userId]);
    await conn.query(
      "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
      [userId, delta >= 0 ? "credit" : "debit", Math.abs(delta), next, description],
    );
    await conn.commit();
    return next;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function updateProfile(userId: number, name: string, handle: string) {
  await query("UPDATE users SET name=?, handle=? WHERE id=?", [name, handle.toLowerCase(), userId]);
}

export async function updatePassword(userId: number, newPassword: string) {
  const hash = await bcrypt.hash(newPassword, 10);
  await query("UPDATE users SET password_hash=? WHERE id=?", [hash, userId]);
}

export async function listUsers(search = "") {
  if (search) {
    const like = `%${search}%`;
    return query<DbUser>(
      "SELECT * FROM users WHERE name LIKE ? OR email LIKE ? OR handle LIKE ? ORDER BY id DESC LIMIT 200",
      [like, like, like],
    );
  }
  return query<DbUser>("SELECT * FROM users ORDER BY id DESC LIMIT 200");
}

export async function setStatus(userId: number, status: "active" | "suspended") {
  await query("UPDATE users SET status=? WHERE id=?", [status, userId]);
}

export async function setAvatarUrl(userId: number, url: string | null) {
  await query("UPDATE users SET avatar_url=? WHERE id=?", [url, userId]);
}

/**
 * Admin manual verification. Verifying marks the account verified and grants
 * the signup bonus exactly once (reusing the same atomic path as email
 * verification). Unverifying just flips the flag back.
 */
export async function adminSetVerified(userId: number, verified: boolean, bonus: number): Promise<DbUser | null> {
  if (verified) return verifyAndGrantBonus(userId, bonus);
  await query("UPDATE users SET email_verified=0 WHERE id=?", [userId]);
  return findById(userId);
}

/**
 * Permanently delete a user account. FK cascades remove their predictions,
 * transactions, and startup investments; reports they filed are kept (the
 * reporter_id has no FK) for audit. Admin accounts cannot be deleted.
 */
export async function deleteUser(userId: number) {
  const user = await findById(userId);
  if (!user) throw new Error("User not found.");
  if (user.role === "admin") throw new Error("Admin accounts cannot be deleted.");
  await pool.query("DELETE FROM users WHERE id=?", [userId]);
}
