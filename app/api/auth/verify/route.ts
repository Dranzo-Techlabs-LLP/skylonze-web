import { NextResponse } from "next/server";
import { findByVerifyToken, toPublic, verifyAndGrantBonus } from "@/lib/users";
import { hashToken } from "@/lib/token";
import { getUserSession, setUserCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return NextResponse.json({ error: "Missing token." }, { status: 400 });

    const user = await findByVerifyToken(hashToken(String(token)));
    if (!user) return NextResponse.json({ error: "Invalid or expired verification link." }, { status: 400 });

    const bonus = Number(process.env.SIGNUP_BONUS ?? 500);
    const updated = await verifyAndGrantBonus(user.id, bonus);

    // If the verifier isn't logged in (clicked from email on another device), log them in.
    const sess = await getUserSession();
    if (!sess && updated) {
      await setUserCookie({ uid: updated.id, email: updated.email, role: "user", handle: updated.handle });
    }

    return NextResponse.json({ user: updated ? toPublic(updated) : null, granted: bonus });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Verification failed." }, { status: 500 });
  }
}
