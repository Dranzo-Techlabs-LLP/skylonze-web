import { NextResponse } from "next/server";
import { getUserSession } from "@/lib/auth";
import { adjustBalance, findByHandle, findById } from "@/lib/users";
import { cleanHandle } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Send SKY to another user by handle.
export async function POST(req: Request) {
  const sess = await getUserSession();
  if (!sess) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { toHandle, amount } = await req.json();
    const amt = Math.floor(Number(amount));
    if (!amt || amt <= 0) return NextResponse.json({ error: "Enter a valid amount." }, { status: 400 });

    const target = await findByHandle(cleanHandle(String(toHandle || "")));
    if (!target) return NextResponse.json({ error: "Recipient handle not found." }, { status: 404 });
    if (target.id === sess.uid) return NextResponse.json({ error: "Cannot send to yourself." }, { status: 400 });

    const sender = await findById(sess.uid);
    if (!sender || sender.sky_balance < amt) {
      return NextResponse.json({ error: "Insufficient balance." }, { status: 400 });
    }

    await adjustBalance(sender.id, -amt, `Sent to @${target.handle}`);
    await adjustBalance(target.id, amt, `Received from @${sender.handle}`);
    const updated = await findById(sender.id);
    return NextResponse.json({ balance: updated?.sky_balance ?? 0 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Transfer failed." }, { status: 500 });
  }
}
