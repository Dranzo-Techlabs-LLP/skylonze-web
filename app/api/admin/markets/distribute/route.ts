import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { distributeMarket } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Step 2: distribute winnings to the respective users.
export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { marketId } = await req.json();
    const result = await distributeMarket(String(marketId));
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Distribute failed." }, { status: 400 });
  }
}
