import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { deleteCategory, listCategories } from "@/lib/categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function DELETE(_req: Request, { params }: { params: { name: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await deleteCategory(decodeURIComponent(params.name));
    const categories = await listCategories();
    return NextResponse.json({ ok: true, categories });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Delete failed." }, { status: 400 });
  }
}
