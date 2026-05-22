"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MailWarning, Check, Loader2 } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { apiSend } from "@/lib/client";

export function VerifyBanner() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "sending" | "sent">("idle");

  // Hide on admin + auth + verify pages
  if (!user || user.email_verified) return null;
  if (pathname?.startsWith("/admin") || pathname === "/verify" || pathname === "/login" || pathname === "/signup") {
    return null;
  }

  async function resend() {
    setState("sending");
    try {
      await apiSend("/api/auth/resend", "POST");
      setState("sent");
    } catch {
      setState("idle");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }}
        className="border-b border-warn/30 bg-warn/10"
      >
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="flex items-center gap-2 text-xs text-warn">
            <MailWarning className="h-4 w-4 shrink-0" />
            Verify your email (<span className="font-medium">{user.email}</span>) to claim 5,000 SKY and start predicting.
          </p>
          <button
            onClick={resend}
            disabled={state !== "idle"}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-warn/40 bg-warn/10 px-3 text-xs font-medium text-warn hover:bg-warn/20 disabled:opacity-60"
          >
            {state === "sending" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {state === "sent" ? <><Check className="h-3.5 w-3.5" /> Email sent</> : state === "sending" ? "Sending…" : "Resend email"}
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
