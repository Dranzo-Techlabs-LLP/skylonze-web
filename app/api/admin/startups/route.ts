import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createStartup, listStartups } from "@/lib/startups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const startups = await listStartups();
  return NextResponse.json({ startups });
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    if (!b.name || !b.pitch || !b.sector) {
      return NextResponse.json({ error: "Name, pitch and sector are required." }, { status: 400 });
    }
    const startup = await createStartup({
      id: b.id || "",
      name: String(b.name).trim(),
      pitch: String(b.pitch).trim(),
      sector: String(b.sector).trim(),
      raised: Number(b.raised) || 0,
      valuation: Number(b.valuation) || 0,
      growth: Number(b.growth) || 0,
      founders: b.founders || "",
      logoSeed: b.logoSeed || "",
    });
    return NextResponse.json({ startup }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Create failed." }, { status: 400 });
  }
}
