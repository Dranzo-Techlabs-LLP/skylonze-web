import { NextResponse } from "next/server";
import { createUser, findByEmail, findByHandle, toPublic } from "@/lib/users";
import { setUserCookie } from "@/lib/auth";
import { isEmail, isHandle, passwordIssue, cleanHandle } from "@/lib/validate";
import { makeToken, verifyExpiry } from "@/lib/token";
import { sendMail, verificationEmail } from "@/lib/mailer";
import {
  getClientIp, rateLimit, isDisposableEmail, verifyTurnstile,
  SIGNUP_LIMITS, MIN_FORM_FILL_MS,
} from "@/lib/antibot";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, handle, email, password } = body;

    // --- Anti-automation gate (before any DB work) ---
    const ip = getClientIp(req);

    // 1. Per-IP rate limit
    const rl = rateLimit(`signup:${ip}`, SIGNUP_LIMITS);
    if (!rl.ok) {
      return NextResponse.json(
        { error: "Too many sign-up attempts. Please try again later." },
        { status: 429, headers: rl.retryAfter ? { "Retry-After": String(rl.retryAfter) } : undefined },
      );
    }

    // 2. Honeypot — a hidden field real users never fill.
    if (typeof body.company === "string" && body.company.trim() !== "") {
      return NextResponse.json({ error: "Sign-up rejected." }, { status: 400 });
    }

    // 3. Submit-timing trap — humans don't complete the form instantly.
    const elapsed = Number(body.formTime);
    if (Number.isFinite(elapsed) && elapsed >= 0 && elapsed < MIN_FORM_FILL_MS) {
      return NextResponse.json({ error: "Sign-up rejected." }, { status: 400 });
    }

    // 4. Optional CAPTCHA (Cloudflare Turnstile) — no-op unless configured.
    if (!(await verifyTurnstile(body.turnstileToken, ip))) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 400 });
    }

    if (!name || !handle || !email || !password) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const h = cleanHandle(handle);
    if (!isHandle(h)) return NextResponse.json({ error: "Handle must be 3-30 chars: a-z 0-9 . _ -" }, { status: 400 });
    if (!isEmail(email)) return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });

    // 5. Block known disposable / throwaway email domains.
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: "Please use a permanent email address." }, { status: 400 });
    }

    const pwIssue = passwordIssue(password);
    if (pwIssue) return NextResponse.json({ error: pwIssue }, { status: 400 });

    if (await findByEmail(email)) return NextResponse.json({ error: "Email already registered." }, { status: 409 });
    if (await findByHandle(h)) return NextResponse.json({ error: "Handle already taken." }, { status: 409 });

    const { token, hash } = makeToken();
    const user = await createUser({
      name: String(name).trim(),
      handle: h,
      email,
      password,
      verifyTokenHash: hash,
      verifyExpires: verifyExpiry(24),
    });

    // Send verification email (logs link in dev when no SMTP)
    const base = process.env.APP_URL || new URL(req.url).origin;
    const link = `${base}/verify?token=${token}`;
    const mail = verificationEmail(user.name, link);
    await sendMail(user.email, mail.subject, mail.html, mail.text).catch(() => {});

    // Log them in (limited until verified)
    await setUserCookie({ uid: user.id, email: user.email, role: "user", handle: user.handle });
    return NextResponse.json({ user: toPublic(user), verifySent: true }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Signup failed." }, { status: 500 });
  }
}
