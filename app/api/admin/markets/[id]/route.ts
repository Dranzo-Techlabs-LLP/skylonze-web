import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteMarket, updateMarket } from "@/lib/markets";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const b = await req.json();
    const patch: any = {};
    for (const k of ["category", "title", "question", "closes", "hot"]) if (k in b) patch[k] = b[k];
    if ("yes" in b) patch.yes = Math.min(99, Math.max(1, Number(b.yes)));
    if ("volume" in b) patch.volume = Number(b.volume) || 0;
    if ("participants" in b) patch.participants = Number(b.participants) || 0;
    const market = await updateMarket(params.id, patch);
    return NextResponse.json({ market });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await deleteMarket(params.id);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Delete failed." }, { status: 400 });
  }
}
