"use client";
import { motion } from "framer-motion";
import { Flame, Lock, Sparkles } from "lucide-react";
import { streakRewards } from "@/lib/data";
import { SkyCoin } from "./SkyCoin";

export function StreakStrip() {
  return (
    <div className="grid grid-cols-7 gap-2 sm:gap-3">
      {streakRewards.map((r, i) => (
        <motion.div
          key={r.day}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.05 }}
          className={`relative rounded-2xl border p-2.5 sm:p-3 text-center ${
            r.unlocked
              ? "border-violet-400/40 bg-gradient-to-b from-violet-500/15 to-bg-700/40"
              : "border-violet-400/15 bg-bg-700/40"
          }`}
        >
          {r.unlocked ? (
            <Flame className="mx-auto mb-1 h-4 w-4 text-neon-pink" />
          ) : (
            <Lock className="mx-auto mb-1 h-4 w-4 text-ink-400" />
          )}
          <p className="text-[10px] uppercase tracking-wider text-ink-400">Day {r.day}</p>
          <div className="my-1 flex items-center justify-center gap-1">
            <SkyCoin size={14} spin={false} />
            <span className="font-display text-sm font-bold tabular">{r.amount}</span>
          </div>
          {r.special && (
            <p className="inline-flex items-center gap-1 text-[9px] text-neon-pink">
              <Sparkles className="h-3 w-3" /> {r.special}
            </p>
          )}
        </motion.div>
      ))}
    </div>
  );
}
