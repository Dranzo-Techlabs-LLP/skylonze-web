import { NextResponse } from "next/server";
import { getLeaderboard } from "@/lib/leaderboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await getLeaderboard(50);
  return NextResponse.json({ leaders: rows });
}
