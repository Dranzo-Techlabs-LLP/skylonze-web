import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createMarket, listMarkets } from "@/lib/markets";
import { listResolutions, openCountsByMarket, pendingPayout } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [markets, resolutions, counts] = await Promise.all([
    listMarkets(), listResolutions(), openCountsByMarket(),
  ]);
  const resMap = Object.fromEntries(resolutions.map((r) => [r.market_id, r]));

  const list = await Promise.all(
    markets.map(async (m) => {
      const resolution = resMap[m.id] ?? null;
      const pending = resolution && !resolution.distributed ? await pendingPayout(m.id) : { count: 0, total: 0 };
      return {
        id: m.id, title: m.title, category: m.category, question: m.question,
        yes: m.yes, closes: m.closes, volume: m.volume, participants: m.participants, hot: m.hot,
        open: counts[m.id]?.open ?? 0,
        staked: counts[m.id]?.staked ?? 0,
        resolution, pending,
      };
    }),
  );

  return NextResponse.json({ markets: list });
}

// Create a market
export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.title || !b.question || !b.category) {
      return NextResponse.json({ error: "Title, question and category are required." }, { status: 400 });
    }
    const market = await createMarket({
      id: b.id || "",
      category: b.category,
      title: String(b.title).trim(),
      question: String(b.question).trim(),
      closes: b.closes || "Dec 31, 2026",
      yes: Math.min(99, Math.max(1, Number(b.yes) || 50)),
      volume: Number(b.volume) || 0,
      participants: Number(b.participants) || 0,
      hot: !!b.hot,
    });
    return NextResponse.json({ market }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Create failed." }, { status: 400 });
  }
}
