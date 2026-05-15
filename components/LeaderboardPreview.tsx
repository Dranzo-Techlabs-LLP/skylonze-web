"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Crown, ChevronRight, Flame } from "lucide-react";
import { leaderboard } from "@/lib/data";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { SkyCoin } from "./SkyCoin";
import { formatSky } from "@/lib/utils";

const badgeTone = {
  Oracle: "violet",
  Sage: "pink",
  Analyst: "cyan",
  Rookie: "neutral",
} as const;

export function LeaderboardPreview() {
  const top5 = leaderboard.slice(0, 5);
  return (
    <div className="glass rounded-3xl overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-violet-400/15">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-neon-pink" />
          <h3 className="font-display text-lg font-semibold">Top forecasters · Season 01</h3>
        </div>
        <Link href="/leaderboard" className="text-xs text-violet-300 hover:text-white inline-flex items-center gap-1">
          See all <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      <ul className="divide-y divide-violet-400/10">
        {top5.map((u, i) => (
          <motion.li
            key={u.handle}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-4 hover:bg-white/[0.03] transition"
          >
            <span className="w-6 text-center font-display font-bold tabular text-ink-400">
              {u.rank === 1 ? <Crown className="mx-auto h-4 w-4 text-neon-pink" /> : u.rank}
            </span>
            <Avatar seed={u.avatarSeed} size={36} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate font-medium">{u.name}</p>
                <Badge tone={badgeTone[u.badge]} className="hidden sm:inline-flex">{u.badge}</Badge>
              </div>
              <p className="truncate text-[11px] text-ink-400">{u.handle}</p>
            </div>
            <div className="hidden md:flex items-center gap-1 text-xs text-neon-pink">
              <Flame className="h-3.5 w-3.5" /> {u.streak}d
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Profit</p>
              <p className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                <SkyCoin size={14} spin={false} /> {formatSky(u.profit)}
              </p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}
