import { pool, query } from "./db";

export async function listCategories(): Promise<string[]> {
  const rows = await query<{ name: string }>("SELECT name FROM categories ORDER BY sort_order ASC, name ASC");
  return rows.map((r) => r.name);
}

export async function createCategory(name: string): Promise<string> {
  const clean = name.trim().slice(0, 40);
  if (!clean) throw new Error("Category name required.");
  const [exists]: any = await pool.query("SELECT name FROM categories WHERE name=?", [clean]);
  if (exists.length) throw new Error("Category already exists.");
  const [maxRow]: any = await pool.query("SELECT COALESCE(MAX(sort_order),0)+1 AS n FROM categories");
  await pool.query("INSERT INTO categories (name, sort_order) VALUES (?,?)", [clean, maxRow[0].n]);
  return clean;
}

export async function deleteCategory(name: string) {
  const [used]: any = await pool.query("SELECT COUNT(*) n FROM markets WHERE category=?", [name]);
  if (used[0].n > 0) throw new Error(`Cannot delete: ${used[0].n} market(s) use this category.`);
  await pool.query("DELETE FROM categories WHERE name=?", [name]);
}

/**
 * Persist a new tab order. Renumbers sort_order to match `order`; any known
 * categories missing from `order` keep their relative order at the end, so the
 * set can never drift. Returns the resulting list.
 */
export async function reorderCategories(order: string[]): Promise<string[]> {
  const current = await listCategories();
  const known = new Set(current);
  const seen = new Set<string>();
  const final: string[] = [];
  for (const n of order) if (known.has(n) && !seen.has(n)) { final.push(n); seen.add(n); }
  for (const n of current) if (!seen.has(n)) final.push(n);

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (let i = 0; i < final.length; i++) {
      await conn.query("UPDATE categories SET sort_order=? WHERE name=?", [i + 1, final[i]]);
    }
    await conn.commit();
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
  return listCategories();
}
