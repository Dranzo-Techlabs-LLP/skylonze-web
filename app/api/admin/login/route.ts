import { NextResponse } from "next/server";
import { findByEmail, verifyPassword } from "@/lib/users";
import { setAdminCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ error: "Email and password required." }, { status: 400 });

    const user = await findByEmail(email);
    if (!user || user.role !== "admin" || !(await verifyPassword(user, password))) {
      // Generic message — do not reveal whether an admin account exists.
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    await setAdminCookie({ uid: user.id, email: user.email, role: "admin", handle: user.handle });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Login failed." }, { status: 500 });
  }
}
