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
  created_at: string;
};

export type PublicUser = Omit<DbUser, "password_hash">;

export function toPublic(u: DbUser): PublicUser {
  const { password_hash, ...rest } = u;
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

export async function createUser(opts: {
  name: string;
  handle: string;
  email: string;
  password: string;
  bonus: number;
}): Promise<DbUser> {
  const hash = await bcrypt.hash(opts.password, 10);
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [res]: any = await conn.query(
      "INSERT INTO users (name, handle, email, password_hash, role, sky_balance, avatar_seed) VALUES (?,?,?,?,?,?,?)",
      [opts.name, opts.handle.toLowerCase(), opts.email.toLowerCase(), hash, "user", opts.bonus, opts.handle.toLowerCase()],
    );
    const id = res.insertId as number;
    if (opts.bonus > 0) {
      await conn.query(
        "INSERT INTO transactions (user_id, type, amount, balance_after, description) VALUES (?,?,?,?,?)",
        [id, "credit", opts.bonus, opts.bonus, "Welcome pack — starter SKY-3030"],
      );
    }
    await conn.commit();
    const [rows]: any = await conn.query("SELECT * FROM users WHERE id=?", [id]);
    return rows[0] as DbUser;
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
