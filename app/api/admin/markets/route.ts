import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { markets } from "@/lib/data";
import { listResolutions, openCountsByMarket, pendingPayout } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [resolutions, counts] = await Promise.all([listResolutions(), openCountsByMarket()]);
  const resMap = Object.fromEntries(resolutions.map((r) => [r.market_id, r]));

  const list = await Promise.all(
    markets.map(async (m) => {
      const resolution = resMap[m.id] ?? null;
      const pending = resolution && !resolution.distributed ? await pendingPayout(m.id) : { count: 0, total: 0 };
      return {
        id: m.id,
        title: m.title,
        category: m.category,
        yes: m.yes,
        closes: m.closes,
        open: counts[m.id]?.open ?? 0,
        staked: counts[m.id]?.staked ?? 0,
        resolution,
        pending,
      };
    }),
  );

  return NextResponse.json({ markets: list });
}
