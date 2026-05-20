import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, updatePassword, verifyPassword } from "@/lib/users";
import { passwordIssue } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { current, next } = await req.json();
    if (!current || !next) return NextResponse.json({ error: "Both fields required." }, { status: 400 });
    const issue = passwordIssue(next);
    if (issue) return NextResponse.json({ error: issue }, { status: 400 });

    const user = await findById(sess.uid);
    if (!user || !(await verifyPassword(user, current))) {
      return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
    }
    await updatePassword(sess.uid, next);
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 500 });
  }
}
