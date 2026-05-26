import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, setAvatarUrl, toPublic } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { avatarUrl } = await req.json();
    await setAvatarUrl(sess.uid, avatarUrl ?? null);
    const user = await findById(sess.uid);
    return NextResponse.json({ user: user ? toPublic(user) : null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}
