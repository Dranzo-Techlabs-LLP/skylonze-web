import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { setReportStatus } from "@/lib/reports";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await getAdminSession();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { status } = await req.json();
    if (status !== "open" && status !== "resolved") {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const report = await setReportStatus(Number(params.id), status);
    return NextResponse.json({ report });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Update failed." }, { status: 400 });
  }
}
