import { NextResponse } from "next/server";
import { createUser, findByEmail, findByHandle, toPublic } from "@/lib/users";
import { setUserCookie } from "@/lib/auth";
import { isEmail, isHandle, passwordIssue, cleanHandle } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { name, handle, email, password } = await req.json();
    if (!name || !handle || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const h = cleanHandle(handle);
    if (!isHandle(h)) return NextResponse.json({ error: "Handle must be 3-30 chars: a-z 0-9 . _ -" }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    const pwIssue = passwordIssue(password);
    if (pwIssue) return NextResponse.json({ error: pwIssue }, { status: 400 });

    if (await findByEmail(email)) return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    if (await findByHandle(h)) return NextResponse.json({ error: "Handle already taken." }, { status: 409 });

    const bonus = Number(process.env.SIGNUP_BONUS ?? 5000);
    const user = await createUser({ name: String(name).trim(), handle: h, email, password, bonus });

    await setUserCookie({ uid: user.id, email: user.email, role: "user", handle: user.handle });
    return NextResponse.json({ user: toPublic(user) }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Signup failed." }, { status: 500 });
  }
}
