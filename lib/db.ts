import mysql from "mysql2/promise";

declare global {
  // eslint-disable-next-line no-var
  var _skyPool: mysql.Pool | undefined;
}

export const pool =
  global._skyPool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT ?? 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
  });

if (process.env.NODE_ENV !== "production") global._skyPool = pool;

export async function query<T = any>(sql: string, params?: any): Promise<T[]> {
  const [rows] = await pool.query(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params?: any): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] ?? null;
}
