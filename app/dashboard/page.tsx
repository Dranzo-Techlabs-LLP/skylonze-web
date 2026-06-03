"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MarketCard } from "@/components/MarketCard";
import { StreakStrip } from "@/components/StreakStrip";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { SkyCoin } from "@/components/SkyCoin";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { useAuth } from "@/components/AuthProvider";
import { apiGet } from "@/lib/client";
import type { Market } from "@/lib/data";
import { formatSky, formatBalance } from "@/lib/utils";
import { TrendingUp, Target, Trophy } from "lucide-react";

type Prediction = {
  id: number;
  market_id: string;
  market_title: string;
  category: string;
  side: "YES" | "NO";
  stake: number;
  entry_prob: number;
  potential_payout: number;
  status: "open" | "won" | "lost";
  created_at: string;
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [preds, setPreds] = useState<Prediction[]>([]);
  const [markets, setMarkets] = useState<Market[]>([]);
  const [summary, setSummary] = useState({ open: 0, staked: 0, potential: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiGet<{ predictions: Prediction[]; summary: typeof summary }>("/api/predictions"),
      apiGet<{ markets: Market[] }>("/api/markets"),
    ])
      .then(([p, m]) => { setPreds(p.predictions); setSummary(p.summary); setMarkets(m.markets); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const open = preds.filter((p) => p.status === "open");
  const recommended = markets.filter((m) => !open.some((p) => p.market_id === m.id)).slice(0, 3);
  const firstName = user?.name?.split(" ")[0] || "Forecaster";

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={<>Welcome back, <span className="text-gradient">{firstName}</span>.</>}
        description="Your daily prediction hub — balance, open positions, and recommendations."
        right={<Link href="/markets"><Button>Open markets <TrendingUp className="h-4 w-4" /></Button></Link>}
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "SKY balance", value: user ? formatBalance(user.sky_balance) : "—", sub: "available", coin: true },
          { label: "Open positions", value: String(summary.open), sub: `${formatSky(summary.staked)} staked`, icon: Target },
          { label: "Potential payout", value: formatSky(summary.potential), sub: "if all win", icon: TrendingUp },
          { label: "Rank", value: summary.open > 0 ? "Unranked" : "New", sub: "Season 01", icon: Trophy },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-violet-300">
              {s.coin ? <SkyCoin size={16} /> : s.icon ? <s.icon className="h-4 w-4" /> : null}
              <p className="text-[10px] uppercase tracking-wider text-ink-400">{s.label}</p>
            </div>
            <p className="mt-2 font-display text-2xl font-bold tabular text-gradient">{s.value}</p>
            <p className="text-[11px] text-ink-400">{s.sub}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 glass rounded-3xl p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">Your open positions</h2>
            <Badge tone="violet">{open.length} active</Badge>
          </div>

          {loading ? (
            <div className="py-10 text-center text-sm text-ink-400">Loading…</div>
          ) : open.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-ink-300">No open positions yet.</p>
              <Link href="/markets"><Button className="mt-4" size="sm">Make your first prediction</Button></Link>
            </div>
          ) : (
            <ul className="mt-4 divide-y divide-violet-400/10">
              {open.map((p) => (
                <li key={p.id} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <Link href={`/markets/${p.market_id}`} className="block truncate text-sm font-medium hover:text-white">
                      {p.market_title}
                    </Link>
                    <p className="truncate text-[11px] text-ink-400">
                      {p.category} · {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">Side</p>
                    <p className={`font-display text-sm font-bold ${p.side === "YES" ? "text-success" : "text-danger"}`}>
                      {p.side} · {p.entry_prob}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">Stake</p>
                    <p className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                      <SkyCoin size={14} /> {formatSky(p.stake)}
                    </p>
                  </div>
                  <div className="hidden sm:block text-right">
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">Payout</p>
                    <p className="font-display text-sm font-bold tabular text-success">{formatSky(p.potential_payout)}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-5">
            <h3 className="font-display text-lg font-semibold">Daily streak</h3>
            <p className="text-xs text-ink-400">Make at least one forecast each day</p>
            <div className="mt-4"><StreakStrip /></div>
          </div>
          <LeaderboardPreview />
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-lg md:text-xl font-semibold mb-4">Recommended for you</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((m, i) => <MarketCard key={m.id} m={m} index={i} />)}
        </div>
      </section>
    </>
  );
}
