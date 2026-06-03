"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { SkyCoin } from "@/components/SkyCoin";
import { formatSky } from "@/lib/utils";
import { apiGet } from "@/lib/client";
import type { LeaderRow } from "@/lib/leaderboard";

const tones = { Oracle: "violet", Sage: "pink", Analyst: "cyan", Rookie: "neutral" } as const;

const BADGE_GUIDE = [
  { badge: "Oracle", tone: "violet", req: "10+ settled forecasts, 100K+ SKY realized profit, and 70%+ accuracy.", blurb: "The elite tier — reserved for the most accurate, high-volume forecasters." },
  { badge: "Sage", tone: "pink", req: "25,000+ SKY in realized profit.", blurb: "Proven, consistently profitable predictors climbing toward Oracle." },
  { badge: "Analyst", tone: "cyan", req: "At least one settled (won or lost) forecast.", blurb: "Active forecasters building a track record on resolved markets." },
  { badge: "Rookie", tone: "neutral", req: "No settled forecasts yet.", blurb: "New arrivals — make predictions and resolve markets to rank up." },
] as const;

function BadgeGuide() {
  return (
    <div className="glass mt-8 rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Trophy className="h-5 w-5 text-violet-300" />
        <h2 className="font-display text-lg font-bold uppercase tracking-wide">How badges work</h2>
      </div>
      <p className="mt-1 text-sm text-ink-400">
        Badges are earned automatically from your settled predictions. Rank up by winning markets and growing realized SKY profit.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {BADGE_GUIDE.map((b) => (
          <div key={b.badge} className="rounded-2xl border border-violet-400/15 bg-white/[0.03] p-4">
            <div className="flex items-center gap-2">
              <Badge tone={b.tone}>{b.badge}</Badge>
              <span className="text-[11px] uppercase tracking-wider text-ink-400">{b.req}</span>
            </div>
            <p className="mt-2 text-sm text-ink-300">{b.blurb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [rows, setRows] = useState<LeaderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ leaders: LeaderRow[] }>("/api/leaderboard")
      .then(({ leaders }) => setRows(leaders))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const ranked = rows.slice(0, 10);

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
                {ranked.map((u, i) => (
                  <motion.li key={u.handle} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.03, 0.5) }}
                    className="grid grid-cols-12 items-center gap-3 px-5 py-4 hover:bg-white/[0.03] transition">
                    <span className="col-span-2 md:col-span-1 font-display text-base font-bold tabular text-ink-300">#{u.rank}</span>
                    <div className="col-span-10 md:col-span-4 flex items-center gap-3 min-w-0">
                      <Avatar seed={u.avatar_seed || u.handle} size={36} src={u.avatar_url} />
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

            <BadgeGuide />
          </>
        )}
      </section>
    </>
  );
}
