// Anti-automation helpers for public endpoints (esp. signup).
//
// Layered defense — each layer is cheap and independent:
//   1. Per-IP rate limiting (volume from one source)
//   2. Honeypot field (naive form bots)
//   3. Submit-timing trap (instant submissions)
//   4. Disposable-email block (throwaway inboxes)
//   5. Optional Cloudflare Turnstile (env-gated; the strong layer)

// ---- 1. In-memory rate limiter (single-instance / PM2 fork friendly) ----
type Hit = { count: number; first: number; last: number };
const buckets = new Map<string, Hit>();

export function rateLimit(
  key: string,
  opts: { windowMs: number; max: number; minIntervalMs?: number },
): { ok: boolean; retryAfter?: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow unbounded.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (now - v.last > opts.windowMs) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || now - b.first > opts.windowMs) {
    buckets.set(key, { count: 1, first: now, last: now });
    return { ok: true };
  }
  if (opts.minIntervalMs && now - b.last < opts.minIntervalMs) {
    return { ok: false, retryAfter: Math.ceil((opts.minIntervalMs - (now - b.last)) / 1000) };
  }
  if (b.count >= opts.max) {
    return { ok: false, retryAfter: Math.ceil((opts.windowMs - (now - b.first)) / 1000) };
  }
  b.count += 1;
  b.last = now;
  return { ok: true };
}

// ---- Client IP (behind a reverse proxy) ----
export function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// ---- 4. Disposable email domains (common throwaway providers) ----
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
  "temp-mail.org", "throwawaymail.com", "yopmail.com", "getnada.com",
  "trashmail.com", "sharklasers.com", "guerrillamailblock.com", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "fakeinbox.com", "tempinbox.com",
  "mohmal.com", "emailondeck.com", "mailcatch.com", "spamgourmet.com",
  "discard.email", "tempr.email", "moakt.com", "luxusmail.org", "1secmail.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.toLowerCase().split("@")[1] || "";
  return DISPOSABLE.has(domain);
}

// ---- 5. Cloudflare Turnstile verification (optional) ----
export const turnstileEnabled = !!process.env.TURNSTILE_SECRET_KEY;

/** Returns true if Turnstile isn't configured (skip), or the token verifies. */
export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured → don't block
  if (!token) return false;
  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (ip && ip !== "unknown") form.set("remoteip", ip);
    const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body: form,
    });
    const j: any = await r.json().catch(() => ({ success: false }));
    return !!j.success;
  } catch {
    return false;
  }
}

// ---- Tunables ----
export const SIGNUP_LIMITS = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                   // max 5 signups per IP per hour
  minIntervalMs: 30 * 1000, // and at least 30s apart
};

/** Minimum time (ms) a human plausibly needs to fill the signup form. */
export const MIN_FORM_FILL_MS = 2500;
