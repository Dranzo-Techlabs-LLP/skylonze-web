import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { getUserSession, getAdminSession } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"]);
const MAX = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  const admin = await getAdminSession();
  const user = admin ? null : await getUserSession();
  if (!admin && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form-data." }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file." }, { status: 400 });
  }
  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Type not allowed. Use PNG/JPG/WebP/GIF/SVG." }, { status: 400 });
  }
  if (file.size > MAX) {
    return NextResponse.json({ error: "Max file size is 2 MB." }, { status: 400 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const ext = file.type === "image/jpeg" ? ".jpg"
    : file.type === "image/svg+xml" ? ".svg"
    : "." + file.type.split("/")[1];
  const id = crypto.randomBytes(8).toString("hex");
  const filename = `${Date.now()}-${id}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buf);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
