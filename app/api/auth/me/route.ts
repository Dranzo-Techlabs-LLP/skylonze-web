import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { findById, toPublic } from "@/lib/users";
import { touchStreak } from "@/lib/streak";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ user: null }, { status: 200 });

  // Daily login streak — awards at most once per calendar day, no-op otherwise.
  let streakBonus: { amount: number; day: number } | null = null;
  try { streakBonus = await touchStreak(sess.uid); } catch { /* never block auth */ }

  const user = await findById(sess.uid);
  if (!user) return NextResponse.json({ user: null }, { status: 200 });
  return NextResponse.json({ user: toPublic(user), streakBonus });
}
