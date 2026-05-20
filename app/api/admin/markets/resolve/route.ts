import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { resolveMarket } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { marketId, outcome } = await req.json();
    const result = await resolveMarket(String(marketId), outcome, admin.uid);
    return NextResponse.json({ ok: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Resolve failed." }, { status: 400 });
  }
}
