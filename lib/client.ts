"use client";

export type Me = {
  id: number;
  name: string;
  handle: string;
  email: string;
  role: "user" | "admin";
  sky_balance: number;
  status: "active" | "suspended";
  avatar_seed: string | null;
  created_at: string;
};

export async function apiGet<T = any>(url: string): Promise<T> {
  const r = await fetch(url, { credentials: "include", cache: "no-store" });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j;
}

export async function apiSend<T = any>(
  url: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: any,
): Promise<T> {
  const r = await fetch(url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(j.error || `Request failed (${r.status})`);
  return j;
}

export async function fetchMe(): Promise<Me | null> {
  try {
    const { user } = await apiGet<{ user: Me | null }>("/api/auth/me");
    return user;
  } catch {
    return null;
  }
}
