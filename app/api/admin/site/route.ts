import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAllSettings, setSetting, STAT_KEYS } from "@/lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const settings = await getAllSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    // Only accept whitelisted stat keys for now.
    for (const k of STAT_KEYS) {
      if (k in body) {
        const v = body[k];
        await setSetting(`stats.${k}`, v === null || v === "" ? null : String(v));
      }
    }
    const settings = await getAllSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}
