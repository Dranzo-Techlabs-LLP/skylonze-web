import { pool, query, queryOne } from "./db";

export type Report = {
  id: number;
  reporter_id: number;
  reporter_handle?: string;
  reported_handle: string;
  category: string;
  details: string | null;
  status: "open" | "resolved";
  created_at: string;
};

export const REPORT_CATEGORIES = ["hacking", "cheating", "bug_exploit", "policy", "other"] as const;

export async function createReport(opts: {
  reporterId: number;
  reportedHandle: string;
  category: string;
  details?: string;
}): Promise<Report> {
  const cat = (REPORT_CATEGORIES as readonly string[]).includes(opts.category) ? opts.category : "other";
  const [res]: any = await pool.query(
    "INSERT INTO reports (reporter_id, reported_handle, category, details) VALUES (?,?,?,?)",
    [opts.reporterId, opts.reportedHandle.toLowerCase(), cat, opts.details?.slice(0, 1000) || null],
  );
  return (await queryOne<Report>("SELECT * FROM reports WHERE id=?", [res.insertId])) as Report;
}

export async function listReports(status?: "open" | "resolved"): Promise<Report[]> {
  if (status) {
    return query<Report>(
      `SELECT r.*, u.handle AS reporter_handle FROM reports r
       LEFT JOIN users u ON u.id = r.reporter_id
       WHERE r.status=? ORDER BY r.id DESC LIMIT 200`,
      [status],
    );
  }
  return query<Report>(
    `SELECT r.*, u.handle AS reporter_handle FROM reports r
     LEFT JOIN users u ON u.id = r.reporter_id
     ORDER BY r.status='resolved', r.id DESC LIMIT 200`,
  );
}

export async function setReportStatus(id: number, status: "open" | "resolved") {
  await pool.query("UPDATE reports SET status=? WHERE id=?", [status, id]);
  return queryOne<Report>("SELECT * FROM reports WHERE id=?", [id]);
}
