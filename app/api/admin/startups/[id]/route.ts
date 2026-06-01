import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteStartup, updateStartup } from "@/lib/startups";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    const patch: any = {};
    for (const k of ["name", "pitch", "sector", "founders", "logoSeed"]) if (k in b) patch[k] = b[k];
    if ("logoUrl" in b) patch.logoUrl = b.logoUrl ?? null;
    for (const k of ["raised", "valuation", "growth"]) if (k in b) patch[k] = Number(b[k]) || 0;
    const startup = await updateStartup(params.id, patch);
    return NextResponse.json({ startup });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await deleteStartup(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Delete failed." }, { status: 400 });
  }
}
