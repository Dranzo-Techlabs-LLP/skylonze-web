import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, getTransactions, toPublic } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await findById(sess.uid);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const txns = await getTransactions(user.id, 50);
  return NextResponse.json({ user: toPublic(user), transactions: txns });
}
