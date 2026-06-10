import { NextResponse } from "next/server";
import { getConverterRate } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: USD value of 1 SKY.
export async function GET() {
  const rate = await getConverterRate();
  return NextResponse.json({ rate });
}
