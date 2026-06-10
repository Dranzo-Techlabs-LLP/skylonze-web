import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { createCategory, listCategories } from "@/lib/categories";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const categories = await listCategories();
  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { name } = await req.json();
    const created = await createCategory(String(name || ""));
    const categories = await listCategories();
    return NextResponse.json({ created, categories }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Create failed." }, { status: 400 });
  }
}
