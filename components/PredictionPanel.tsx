"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { Button } from "./Button";
import { SkyCoin } from "./SkyCoin";
import { cn, formatSky } from "@/lib/utils";

export function PredictionPanel({ yes }: { yes: number }) {
  const [side, setSide] = useState<"YES" | "NO">("YES");
  const [amount, setAmount] = useState(500);
  const [placed, setPlaced] = useState(false);

  const prob = side === "YES" ? yes : 100 - yes;
  const odds = prob > 0 ? +(100 / prob).toFixed(2) : 0;
  const payout = +(amount * odds).toFixed(0);

  return (
    <div className="glass-strong rounded-3xl p-5 sm:p-6">
      <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Place forecast</p>
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
                : "border-violet-400/20 bg-white/[0.03] text-ink-300 hover:text-white"
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
        <label htmlFor="amount" className="text-xs uppercase tracking-wider text-ink-400">
          Amount (SKY)
        </label>
        <div className="mt-2 flex items-center gap-2 rounded-2xl border border-violet-400/25 bg-white/5 p-2">
          <SkyCoin size={28} />
          <input
            id="amount"
            type="number"
            min={10}
            value={amount}
            onChange={(e) => setAmount(Math.max(10, Number(e.target.value) || 0))}
            className="flex-1 bg-transparent px-2 py-2 font-display text-xl font-bold tabular outline-none"
          />
        </div>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {[100, 500, 1000, 5000].map((q) => (
            <button
              key={q}
              onClick={() => setAmount(q)}
              className="h-9 rounded-lg border border-violet-400/20 bg-white/[0.03] text-xs text-ink-200 hover:text-white"
            >
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

      <Button
        onClick={() => {
          setPlaced(true);
          setTimeout(() => setPlaced(false), 1800);
        }}
        size="lg"
        className="mt-5 w-full"
      >
        <AnimatePresence mode="wait" initial={false}>
          {placed ? (
            <motion.span
              key="placed"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2"
            >
              <Check className="h-5 w-5" /> Forecast placed
            </motion.span>
          ) : (
            <motion.span
              key="cta"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="inline-flex items-center gap-2"
            >
              <SkyCoin size={18} spin={false} /> Predict {side}
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
