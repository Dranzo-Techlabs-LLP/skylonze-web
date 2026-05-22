"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Check, Lock, AlertCircle, Gavel, MailWarning, Loader2 } from "lucide-react";
import { Button } from "./Button";
import { SkyCoin } from "./SkyCoin";
import { useAuth } from "./AuthProvider";
import { apiSend } from "@/lib/client";
import { cn, formatSky } from "@/lib/utils";

export function PredictionPanel({
  yes,
  marketId,
  resolvedOutcome = null,
}: {
  yes: number;
  marketId: string;
  resolvedOutcome?: "YES" | "NO" | null;
}) {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState(500);
  const [busy, setBusy] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resent, setResent] = useState<"idle" | "sending" | "sent">("idle");

  async function resendVerify() {
    setResent("sending");
    try { await apiSend("/api/auth/resend", "POST"); setResent("sent"); }
    catch { setResent("idle"); }
  }

  const prob = side === "YES" ? yes : 100 - yes;
  const odds = prob > 0 ? +(100 / prob).toFixed(2) : 0;
  const payout = +(amount * odds).toFixed(0);
  const insufficient = !!user && amount > user.sky_balance;

  async function place() {
    setError(null);
    if (amount < 10) { setError("Minimum stake is 10 SKY."); return; }
    if (insufficient) { setError("Insufficient SKY balance."); return; }
    setBusy(true);
    try {
      await apiSend("/api/predictions", "POST", { marketId, side, amount });
      await refresh(); // update balance in nav + context
      setPlaced(true);
      setTimeout(() => setPlaced(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  // Market already resolved: no more predictions
  if (resolvedOutcome) {
    return (
      <div className="glass-strong rounded-3xl p-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10">
          <Gavel className="h-5 w-5 text-violet-300" />
        </span>
        <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Market resolved</p>
        <h3 className="mt-2 font-display text-2xl font-bold">
          Outcome:{" "}
          <span className={resolvedOutcome === "YES" ? "text-success" : "text-danger"}>{resolvedOutcome}</span>
        </h3>
        <p className="mt-2 text-sm text-ink-300">
          This market is settled. Winning predictions have been paid out in SKY-3030.
        </p>
      </div>
    );
  }

  // Logged-in but email not verified: gate with verify prompt
  if (user && !user.email_verified) {
    return (
      <div className="glass-strong rounded-3xl p-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-warn/40 bg-warn/10">
          <MailWarning className="h-5 w-5 text-warn" />
        </span>
        <p className="text-xs uppercase tracking-[0.18em] text-warn">Verify to predict</p>
        <h3 className="mt-2 font-display text-lg font-bold">Confirm your email</h3>
        <p className="mt-2 text-sm text-ink-300">
          We sent a link to <span className="text-white font-medium">{user.email}</span>. Verify to claim
          your 500 SKY and place predictions.
        </p>
        <Button onClick={resendVerify} size="lg" className="mt-5 w-full" disabled={resent !== "idle"}>
          {resent === "sending" && <Loader2 className="h-4 w-4 animate-spin" />}
          {resent === "sent" ? <><Check className="h-4 w-4" /> Email sent</> : resent === "sending" ? "Sending…" : "Resend verification"}
        </Button>
      </div>
    );
  }

  // Logged-out: gate the action
  if (!user) {
    return (
      <div className="glass-strong rounded-3xl p-6 text-center">
        <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10">
          <Lock className="h-5 w-5 text-violet-300" />
        </span>
        <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Members only</p>
        <h3 className="mt-2 font-display text-lg font-bold">Sign in to predict</h3>
        <p className="mt-2 text-sm text-ink-300">
          Create a free profile and get <span className="text-white font-semibold">500 SKY-3030</span> to
          start forecasting this market.
        </p>
        <div className="mt-5 grid gap-2">
          <Link href={`/signup`}>
            <Button size="lg" className="w-full">Claim 500 SKY</Button>
          </Link>
          <Link href={`/login?next=/markets/${marketId}`}>
            <Button size="lg" variant="secondary" className="w-full">Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Place forecast</p>
        <span className="inline-flex items-center gap-1.5 text-xs text-ink-300">
          <SkyCoin size={16} /> <span className="tabular">{formatSky(user.sky_balance)}</span> bal
        </span>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        {(["YES", "NO"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setSide(s)}
            className={cn(
              "relative h-14 rounded-2xl border text-base font-display font-bold transition",
              side === s
                ? s === "YES"
                  ? "border-success/60 bg-success/10 text-success shadow-[0_0_24px_rgba(52,211,153,0.25)]"
                  : "border-danger/60 bg-danger/10 text-danger shadow-[0_0_24px_rgba(248,113,113,0.25)]"
                : "border-violet-400/20 bg-white/[0.03] text-ink-300 hover:text-white",
            )}
            aria-pressed={side === s}
          >
            <span className="flex items-center justify-center gap-2">
              {s === "YES" ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              {s}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-5">
        <label htmlFor="amount" className="text-xs uppercase tracking-wider text-ink-400">Amount (SKY)</label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-violet-400/25 bg-white/5 p-2">
          <SkyCoin size={28} />
          <input
            id="amount" type="number" min={10} value={amount}
            onChange={(e) => setAmount(Math.max(0, Number(e.target.value) || 0))}
            className="flex-1 bg-transparent px-2 py-2 font-display text-xl font-bold tabular outline-none"
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[100, 500, 1000, 5000].map((q) => (
            <button key={q} onClick={() => setAmount(q)}
              className="h-9 rounded-lg border border-violet-400/20 bg-white/[0.03] text-xs text-ink-200 hover:text-white">
              {formatSky(q)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-violet-400/15 bg-white/[0.03] p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">Prob</p>
          <p className="font-display text-base font-bold tabular">{prob}%</p>
        </div>
        <div className="rounded-xl border border-violet-400/15 bg-white/[0.03] p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">Odds</p>
          <p className="font-display text-base font-bold tabular">{odds.toFixed(2)}x</p>
        </div>
        <div className="rounded-xl border border-violet-400/15 bg-gradient-to-br from-violet-500/15 to-neon-pink/10 p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-ink-400">Payout</p>
          <p className="font-display text-base font-bold tabular text-gradient">{formatSky(payout)}</p>
        </div>
      </div>

      {error && (
        <p role="alert" className="mt-3 flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}

      <Button onClick={place} size="lg" className="mt-5 w-full" disabled={busy || insufficient}>
        <AnimatePresence mode="wait" initial={false}>
          {placed ? (
            <motion.span key="placed" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
              <Check className="h-5 w-5" /> Prediction placed
            </motion.span>
          ) : (
            <motion.span key="cta" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="inline-flex items-center gap-2">
              <SkyCoin size={18} /> {busy ? "Placing…" : insufficient ? "Insufficient balance" : `Predict ${side}`}
            </motion.span>
          )}
        </AnimatePresence>
      </Button>

      <p className="mt-3 text-center text-[10px] text-ink-400">
        Virtual currency · For entertainment and forecasting practice
      </p>
    </div>
  );
}
