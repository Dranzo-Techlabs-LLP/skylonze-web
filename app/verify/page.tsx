"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { SLogo } from "@/components/SLogo";
import { Button } from "@/components/Button";
import { SkyCoin } from "@/components/SkyCoin";
import { apiSend, type Me } from "@/lib/client";
import { useAuth } from "@/components/AuthProvider";

export const dynamic = "force-dynamic";

export default function VerifyPage() {
  const { setUser } = useAuth();
  const [state, setState] = useState<"loading" | "ok" | "error">("loading");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { setState("error"); setMsg("No verification token in the link."); return; }
    apiSend<{ user: Me; granted: number }>("/api/auth/verify", "POST", { token })
      .then(({ user }) => {
        if (user) setUser(user);
        setState("ok");
      })
      .catch((e) => { setState("error"); setMsg(e.message); });
  }, [setUser]);

  return (
    <div className="relative flex min-h-[calc(100dvh-4rem)] items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[400px] w-[800px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-strong rounded-3xl p-8 text-center"
      >
        <div className="mx-auto mb-4 w-fit"><SLogo size={44} /></div>

        {state === "loading" && (
          <>
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-violet-300" />
            <p className="mt-4 text-sm text-ink-300">Verifying your email…</p>
          </>
        )}

        {state === "ok" && (
          <>
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <h1 className="mt-4 font-display text-2xl font-bold">Email verified</h1>
            <p className="mt-2 inline-flex items-center justify-center gap-1.5 text-sm text-ink-200">
              <SkyCoin size={18} /> 5,000 SKY-3030 credited to your wallet.
            </p>
            <div className="mt-6 grid gap-2">
              <Link href="/dashboard"><Button size="lg" className="w-full">Go to dashboard</Button></Link>
              <Link href="/markets"><Button size="lg" variant="secondary" className="w-full">Browse markets</Button></Link>
            </div>
          </>
        )}

        {state === "error" && (
          <>
            <XCircle className="mx-auto h-10 w-10 text-danger" />
            <h1 className="mt-4 font-display text-2xl font-bold">Verification failed</h1>
            <p className="mt-2 text-sm text-ink-300">{msg || "This link is invalid or has expired."}</p>
            <p className="mt-4 text-xs text-ink-400">Sign in and use the “Resend email” banner to get a fresh link.</p>
            <div className="mt-6 grid gap-2">
              <Link href="/login"><Button size="lg" className="w-full">Sign in</Button></Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
