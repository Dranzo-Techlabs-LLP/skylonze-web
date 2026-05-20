import { NextResponse } from "next/server";
import { findByEmail, toPublic, verifyPassword } from "@/lib/users";
import { setUserCookie } from "@/lib/auth";

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
    return NextResponse.json({ user: toPublic(user) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Login failed." }, { status: 500 });
  }
}
