import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { createReport } from "@/lib/reports";
import { findByHandle } from "@/lib/users";
import { cleanHandle } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Signed-in users report suspicious activity (hacking, cheating, exploits, policy).
export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Sign in to report a user." }, { status: 401 });
  try {
    const { handle, category, details } = await req.json();
    const h = cleanHandle(String(handle || ""));
    if (!h) return NextResponse.json({ error: "Enter the username to report." }, { status: 400 });

    const target = await findByHandle(h);
    if (!target) return NextResponse.json({ error: "No user with that username." }, { status: 404 });
    if (target.id === sess.uid) return NextResponse.json({ error: "You cannot report yourself." }, { status: 400 });

    const report = await createReport({
      reporterId: sess.uid,
      reportedHandle: h,
      category: String(category || "other"),
      details: details ? String(details) : undefined,
    });
    return NextResponse.json({ ok: true, report }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Report failed." }, { status: 400 });
  }
}
