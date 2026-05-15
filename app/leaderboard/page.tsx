"use client";
import { motion } from "framer-motion";
import { Crown, Flame } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { leaderboard } from "@/lib/data";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { SkyCoin } from "@/components/SkyCoin";
import { formatSky } from "@/lib/utils";
import { useState } from "react";

const tones = { Oracle: "violet", Sage: "pink", Analyst: "cyan", Rookie: "neutral" } as const;
const ranges = ["This week", "This month", "Season 01", "All time"] as const;

export default function LeaderboardPage() {
  const [range, setRange] = useState<(typeof ranges)[number]>("Season 01");
  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title={<>Climb the <span className="text-gradient">Oracle ladder</span>.</>}
        description="Forecasters earn ranks based on profit, accuracy, and streak. Top performers win season-end SKY pools."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Top 3 podium */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
          {leaderboard.slice(0, 3).map((u, i) => {
            const order = i === 0 ? "sm:order-2" : i === 1 ? "sm:order-1" : "sm:order-3";
            const scale = i === 0 ? "sm:scale-[1.05]" : "";
            return (
              <motion.div
                key={u.handle}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`relative ${order} ${scale}`}
              >
                <div className={`gradient-border p-1 ${i === 0 ? "" : "opacity-95"}`}>
                  <div className="relative rounded-2xl bg-bg-800/80 p-5 text-center">
                    {i === 0 && (
                      <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 text-neon-pink" />
                    )}
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">
                      Rank #{u.rank}
                    </p>
                    <div className="mt-3 flex justify-center">
                      <Avatar seed={u.avatarSeed} size={72} />
                    </div>
                    <p className="mt-3 font-display text-lg font-semibold">{u.name}</p>
                    <p className="text-[11px] text-ink-400">{u.handle}</p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                      <Badge tone={tones[u.badge]}>{u.badge}</Badge>
                      <span className="inline-flex items-center gap-1 text-xs text-neon-pink">
                        <Flame className="h-3.5 w-3.5" /> {u.streak}d
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                      <div className="rounded-xl bg-white/[0.04] p-2">
                        <p className="text-[10px] text-ink-400">Profit</p>
                        <p className="font-display text-sm font-bold tabular text-gradient">
                          {formatSky(u.profit)}
                        </p>
                      </div>
                      <div className="rounded-xl bg-white/[0.04] p-2">
                        <p className="text-[10px] text-ink-400">Accuracy</p>
                        <p className="font-display text-sm font-bold tabular">
                          {u.accuracy.toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Range tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {ranges.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`h-9 rounded-full px-4 text-xs font-medium transition ${
                range === r
                  ? "bg-gradient-to-r from-violet-600 to-neon-pink text-white shadow-glow"
                  : "border border-violet-400/20 text-ink-300 hover:text-white"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-400 border-b border-violet-400/15">
            <span className="col-span-1">Rank</span>
            <span className="col-span-4">Forecaster</span>
            <span className="col-span-2 text-right">Profit</span>
            <span className="col-span-2 text-right">Accuracy</span>
            <span className="col-span-1 text-right">Streak</span>
            <span className="col-span-2 text-right">Badge</span>
          </div>
          <ul className="divide-y divide-violet-400/10">
            {leaderboard.map((u, i) => (
              <motion.li
                key={u.handle}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition"
              >
                <span className="col-span-2 md:col-span-1 font-display text-base font-bold tabular text-ink-300">
                  #{u.rank}
                </span>
                <div className="col-span-10 md:col-span-4 flex items-center gap-3 min-w-0">
                  <Avatar seed={u.avatarSeed} size={36} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-[11px] text-ink-400">{u.handle}</p>
                  </div>
                </div>
                <span className="col-span-4 md:col-span-2 md:text-right text-xs text-ink-400 md:text-ink-200">
                  <span className="md:hidden">Profit · </span>
                  <span className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                    <SkyCoin size={14} spin={false} /> {formatSky(u.profit)}
                  </span>
                </span>
                <span className="col-span-4 md:col-span-2 md:text-right text-xs text-ink-200">
                  <span className="md:hidden">Acc · </span>
                  <span className="font-display font-semibold tabular">{u.accuracy.toFixed(1)}%</span>
                </span>
                <span className="col-span-4 md:col-span-1 md:text-right text-xs text-neon-pink inline-flex items-center md:justify-end gap-1">
                  <Flame className="h-3.5 w-3.5" /> {u.streak}d
                </span>
                <span className="col-span-12 md:col-span-2 md:text-right">
                  <Badge tone={tones[u.badge]}>{u.badge}</Badge>
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
