import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { revealMarket } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 1: set/reveal the market result (marks won/lost, no payout yet).
export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { marketId, outcome } = await req.json();
    const result = await revealMarket(String(marketId), outcome, admin.uid);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Reveal failed." }, { status: 400 });
  }
}
