import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, setVerifyToken } from "@/lib/users";
import { makeToken, verifyExpiry } from "@/lib/token";
import { sendMail, verificationEmail } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await findById(sess.uid);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.email_verified) return NextResponse.json({ ok: true, alreadyVerified: true });

  const { token, hash } = makeToken();
  await setVerifyToken(user.id, hash, verifyExpiry(24));

  const base = process.env.APP_URL || new URL(req.url).origin;
  const link = `${base}/verify?token=${token}`;
  const mail = verificationEmail(user.name, link);
  await sendMail(user.email, mail.subject, mail.html, mail.text).catch(() => {});

  return NextResponse.json({ ok: true });
}
