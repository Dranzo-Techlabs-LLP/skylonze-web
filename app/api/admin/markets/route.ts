import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { markets } from "@/lib/data";
import { listResolutions, openCountsByMarket } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [resolutions, counts] = await Promise.all([listResolutions(), openCountsByMarket()]);
  const resMap = Object.fromEntries(resolutions.map((r) => [r.market_id, r]));

  const list = markets.map((m) => ({
    id: m.id,
    title: m.title,
    category: m.category,
    yes: m.yes,
    closes: m.closes,
    open: counts[m.id]?.open ?? 0,
    staked: counts[m.id]?.staked ?? 0,
    resolution: resMap[m.id] ?? null,
  }));

  return NextResponse.json({ markets: list });
}
