import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById } from "@/lib/users";
import { investInStartup } from "@/lib/investments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Sign in to back a startup." }, { status: 401 });

  const user = await findById(sess.uid);
  if (!user?.email_verified) {
    return NextResponse.json({ error: "Verify your email to back startups." }, { status: 403 });
  }

  try {
    const { startupId, amount } = await req.json();
    const result = await investInStartup({
      userId: sess.uid,
      startupId: String(startupId),
      amount: Number(amount),
    });
    return NextResponse.json(result, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Investment failed." }, { status: 400 });
  }
}
