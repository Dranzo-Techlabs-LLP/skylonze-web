import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { adjustBalance, findById, setAvatarUrl, setStatus, toPublic } from "@/lib/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const id = Number(params.id);
  if (!id) return NextResponse.json({ error: "Bad id" }, { status: 400 });

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "adjust") {
      const delta = Math.floor(Number(body.amount));
      if (!delta) return NextResponse.json({ error: "Enter a non-zero amount." }, { status: 400 });
      await adjustBalance(id, delta, body.note || `Admin adjustment by ${admin.email}`);
    } else if (action === "suspend") {
      await setStatus(id, "suspended");
    } else if (action === "activate") {
      await setStatus(id, "active");
    } else if (action === "avatar") {
      await setAvatarUrl(id, body.avatarUrl ?? null);
    } else {
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }

    const user = await findById(id);
    return NextResponse.json({ user: user ? toPublic(user) : null });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Action failed." }, { status: 500 });
  }
}
