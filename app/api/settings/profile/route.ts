import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findByHandle, findById, toPublic, updateProfile } from "@/lib/users";
import { cleanHandle, isHandle } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, handle } = await req.json();
    if (!name || !handle) return NextResponse.json({ error: "Name and handle required." }, { status: 400 });
    const h = cleanHandle(handle);
    if (!isHandle(h)) return NextResponse.json({ error: "Handle must be 3-30 chars: a-z 0-9 . _ -" }, { status: 400 });

    const existing = await findByHandle(h);
    if (existing && existing.id !== sess.uid) {
      return NextResponse.json({ error: "Handle already taken." }, { status: 409 });
    }
    await updateProfile(sess.uid, String(name).trim(), h);
    const user = await findById(sess.uid);
    return NextResponse.json({ user: user ? toPublic(user) : null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 500 });
  }
}
