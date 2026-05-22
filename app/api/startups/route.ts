import { NextResponse } from "next/server";
import { listStartups } from "@/lib/startups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const startups = await listStartups();
  return NextResponse.json({ startups });
}
