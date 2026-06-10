import { NextResponse } from "next/server";
import { findByEmail, findById, toPublic, verifyPassword } from "@/lib/users";
import { setUserCookie } from "@/lib/auth";
import { touchStreak } from "@/lib/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required." }, { status: 400 });

    const user = await findByEmail(email);
    if (!user || !(await verifyPassword(user, password))) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }
    if (user.role !== "user") {
      return NextResponse.json({ error: "Use the admin portal to sign in." }, { status: 403 });
    }
    if (user.status === "suspended") {
      return NextResponse.json({ error: "Account suspended. Contact support." }, { status: 403 });
    }

    await setUserCookie({ uid: user.id, email: user.email, role: "user", handle: user.handle });

    // Daily login streak — at most once per calendar day.
    let streakBonus: { amount: number; day: number } | null = null;
    try { streakBonus = await touchStreak(user.id); } catch { /* never block login */ }
    const fresh = streakBonus ? await findById(user.id) : user;

    return NextResponse.json({ user: toPublic(fresh ?? user), streakBonus });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Login failed." }, { status: 500 });
  }
}
