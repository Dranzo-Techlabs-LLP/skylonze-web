import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listReports } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const status = url.searchParams.get("status") as "open" | "resolved" | null;
  const reports = await listReports(status ?? undefined);
  return NextResponse.json({ reports });
}
