import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, toPublic } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ user: null }, { status: 200 });
  const user = await findById(sess.uid);
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: toPublic(user) });
}
