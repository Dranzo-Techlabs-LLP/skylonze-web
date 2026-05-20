import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { listUsers, toPublic } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const search = url.searchParams.get("q") ?? "";
  const users = await listUsers(search);
  return NextResponse.json({ users: users.map(toPublic) });
}
