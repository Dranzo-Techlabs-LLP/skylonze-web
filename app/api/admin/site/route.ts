import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { CONVERTER_RATE_KEY, getAllSettings, setSetting, STAT_KEYS } from "@/lib/site-settings";

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
    // Only accept whitelisted keys.
    for (const k of STAT_KEYS) {
      if (k in body) {
        const v = body[k];
        await setSetting(`stats.${k}`, v === null || v === "" ? null : String(v));
      }
    }
    if ("converterRate" in body) {
      const v = body.converterRate;
      const n = Number(v);
      if (v !== null && v !== "" && (!Number.isFinite(n) || n <= 0)) {
        return NextResponse.json({ error: "Conversion rate must be a positive number." }, { status: 400 });
      }
      await setSetting(CONVERTER_RATE_KEY, v === null || v === "" ? null : String(n));
    }
    const settings = await getAllSettings();
    return NextResponse.json({ ok: true, settings });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}
