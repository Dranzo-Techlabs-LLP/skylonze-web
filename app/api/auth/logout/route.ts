import { NextResponse } from "next/server";
import { clearUserCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  clearUserCookie();
  return NextResponse.json({ ok: true });
}
