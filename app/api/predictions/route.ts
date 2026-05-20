import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { listPredictions, placePrediction, predictionSummary } from "@/lib/predictions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [predictions, summary] = await Promise.all([
    listPredictions(sess.uid),
    predictionSummary(sess.uid),
  ]);
  return NextResponse.json({ predictions, summary });
}

export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Sign in to place a prediction." }, { status: 401 });
  try {
    const { marketId, side, amount } = await req.json();
    const { prediction, balance } = await placePrediction({
      userId: sess.uid,
      marketId: String(marketId),
      side,
      stake: Number(amount),
    });
    return NextResponse.json({ prediction, balance }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Failed to place prediction." }, { status: 400 });
  }
}
