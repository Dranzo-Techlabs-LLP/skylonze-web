"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crown, Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { SkyCoin } from "@/components/SkyCoin";
import { formatSky } from "@/lib/utils";
import { apiGet } from "@/lib/client";
import type { LeaderRow } from "@/lib/leaderboard";

const tones = { Oracle: "violet", Sage: "pink", Analyst: "cyan", Rookie: "neutral" } as const;

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ leaders: LeaderRow[] }>("/api/leaderboard")
      .then(({ leaders }) => setRows(leaders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const podium = rows.slice(0, 3);

  return (
    <>
      <PageHeader
        eyebrow="Leaderboard"
        title={<>Climb the <span className="text-gradient">Oracle ladder</span>.</>}
        description="Live ranking by realized SKY profit from settled predictions. Win markets to rise."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        {loading ? (
          <div className="glass rounded-3xl p-12 text-center text-ink-400">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center">
            <Trophy className="mx-auto h-8 w-8 text-violet-300" />
            <p className="mt-3 text-ink-200">No ranked forecasters yet.</p>
            <p className="text-sm text-ink-400">Make predictions — once markets resolve, profit lands you on the board.</p>
          </div>
        ) : (
          <>
            {podium.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-10">
                {podium.map((u, i) => {
                  const order = i === 0 ? "sm:order-2" : i === 1 ? "sm:order-1" : "sm:order-3";
                  const scale = i === 0 ? "sm:scale-[1.05]" : "";
                  return (
                    <motion.div key={u.handle} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }} className={`relative ${order} ${scale}`}>
                      <div className="gradient-border p-1">
                        <div className="relative rounded-2xl bg-bg-800/80 p-5 text-center">
                          {i === 0 && <Crown className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 text-neon-pink" />}
                          <p className="text-[10px] uppercase tracking-wider text-ink-400">Rank #{u.rank}</p>
                          <div className="mt-3 flex justify-center"><Avatar seed={u.avatar_seed || u.handle} size={72} /></div>
                          <p className="mt-3 font-display text-lg font-semibold">{u.name}</p>
                          <p className="text-[11px] text-ink-400">@{u.handle}</p>
                          <div className="mt-3 flex items-center justify-center gap-2">
                            <Badge tone={tones[u.badge]}>{u.badge}</Badge>
                          </div>
                          <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                            <div className="rounded-xl bg-white/[0.04] p-2">
                              <p className="text-[10px] text-ink-400">Profit</p>
                              <p className="font-display text-sm font-bold tabular text-gradient">{formatSky(u.profit)}</p>
                            </div>
                            <div className="rounded-xl bg-white/[0.04] p-2">
                              <p className="text-[10px] text-ink-400">Accuracy</p>
                              <p className="font-display text-sm font-bold tabular">{u.accuracy.toFixed(0)}%</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            <div className="glass rounded-3xl overflow-hidden">
              <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-400 border-b border-violet-400/15">
                <span className="col-span-1">Rank</span>
                <span className="col-span-4">Forecaster</span>
                <span className="col-span-2 text-right">Profit</span>
                <span className="col-span-2 text-right">Accuracy</span>
                <span className="col-span-1 text-right">W/L</span>
                <span className="col-span-2 text-right">Badge</span>
              </div>
              <ul className="divide-y divide-violet-400/10">
                {rows.map((u, i) => (
                  <motion.li key={u.handle} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    className="grid grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition">
                    <span className="col-span-2 md:col-span-1 font-display text-base font-bold tabular text-ink-300">#{u.rank}</span>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3 min-w-0">
                      <Avatar seed={u.avatar_seed || u.handle} size={36} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{u.name}</p>
                        <p className="truncate text-[11px] text-ink-400">@{u.handle}</p>
                      </div>
                    </div>
                    <span className="col-span-4 md:col-span-2 md:text-right text-xs">
                      <span className="md:hidden text-ink-400">Profit · </span>
                      <span className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                        <SkyCoin size={14} /> {formatSky(u.profit)}
                      </span>
                    </span>
                    <span className="col-span-4 md:col-span-2 md:text-right text-xs">
                      <span className="md:hidden text-ink-400">Acc · </span>
                      <span className="font-display font-semibold tabular">{u.accuracy.toFixed(0)}%</span>
                    </span>
                    <span className="col-span-4 md:col-span-1 md:text-right text-xs tabular text-ink-300">
                      {u.wins}/{u.losses}
                    </span>
                    <span className="col-span-12 md:col-span-2 md:text-right">
                      <Badge tone={tones[u.badge]}>{u.badge}</Badge>
                    </span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </>
        )}
      </section>
    </>
  );
}
