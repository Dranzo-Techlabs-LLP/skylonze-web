import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-insecure-secret");
const SESSION_COOKIE = process.env.SESSION_COOKIE || "sky_session";
const ADMIN_COOKIE = process.env.ADMIN_COOKIE || "sky_admin";

export type SessionPayload = {
  uid: number;
  email: string;
  role: "user" | "admin";
  handle?: string;
};

const cookieOpts = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

export async function signSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

// ---- User session (cookie) ----
export async function setUserCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  cookies().set(SESSION_COOKIE, token, cookieOpts);
}
export function clearUserCookie() {
  cookies().set(SESSION_COOKIE, "", { ...cookieOpts, maxAge: 0 });
}
export async function getUserSession(): Promise<SessionPayload | null> {
  const tok = cookies().get(SESSION_COOKIE)?.value;
  if (!tok) return null;
  const s = await verifySession(tok);
  return s && s.role === "user" ? s : null;
}

// ---- Admin session (separate cookie) ----
export async function setAdminCookie(payload: SessionPayload) {
  const token = await signSession(payload);
  cookies().set(ADMIN_COOKIE, token, cookieOpts);
}
export function clearAdminCookie() {
  cookies().set(ADMIN_COOKIE, "", { ...cookieOpts, maxAge: 0 });
}
export async function getAdminSession(): Promise<SessionPayload | null> {
  const tok = cookies().get(ADMIN_COOKIE)?.value;
  if (!tok) return null;
  const s = await verifySession(tok);
  return s && s.role === "admin" ? s : null;
}

export const COOKIES = { SESSION_COOKIE, ADMIN_COOKIE };
