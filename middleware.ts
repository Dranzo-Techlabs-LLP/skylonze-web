import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "dev-insecure-secret");
const SESSION_COOKIE = process.env.SESSION_COOKIE || "sky_session";
const ADMIN_COOKIE = process.env.ADMIN_COOKIE || "sky_admin";

async function role(token?: string): Promise<"user" | "admin" | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return (payload.role as "user" | "admin") ?? null;
  } catch {
    return null;
  }
}

// Routes requiring a user session
const USER_PROTECTED = ["/dashboard", "/wallet", "/profile", "/settings"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area (except the login page itself)
  if (pathname.startsWith("/admin")) {
    const isLogin = pathname === "/admin" || pathname === "/admin/";
    const r = await role(req.cookies.get(ADMIN_COOKIE)?.value);
    if (isLogin) {
      // Already authed admin → send to dashboard
      if (r === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      return NextResponse.next();
    }
    if (r !== "admin") return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }

  // User-protected routes
  if (USER_PROTECTED.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const r = await role(req.cookies.get(SESSION_COOKIE)?.value);
    if (r !== "user") {
      const url = new URL("/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/wallet/:path*", "/profile/:path*", "/settings/:path*"],
};
