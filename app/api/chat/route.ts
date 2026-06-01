import { NextResponse } from "next/server";
import { claudeReply, localReply, type ChatMessage } from "@/lib/assistant";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages: ChatMessage[] = Array.isArray(body?.messages)
    ? body.messages
        .filter((m: any) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
        .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }))
    : [];

  if (!messages.length) {
    return NextResponse.json({ error: "Say something first." }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");

  // Prefer Claude when a key is configured; gracefully fall back to the
  // built-in knowledge base so the assistant always answers.
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const reply = await claudeReply(messages);
      return NextResponse.json({ reply, source: "claude" });
    } catch {
      /* fall through to local */
    }
  }

  return NextResponse.json({ reply: localReply(lastUser?.content ?? ""), source: "local" });
}
