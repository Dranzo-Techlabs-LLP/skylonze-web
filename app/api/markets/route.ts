import { NextResponse } from "next/server";
import { listMarkets } from "@/lib/markets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const markets = await listMarkets();
  return NextResponse.json({ markets });
}
