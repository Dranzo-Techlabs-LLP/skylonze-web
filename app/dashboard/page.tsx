import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { MarketCard } from "@/components/MarketCard";
import { StreakStrip } from "@/components/StreakStrip";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { Sparkline } from "@/components/Sparkline";
import { SkyCoin } from "@/components/SkyCoin";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { markets } from "@/lib/data";
import { formatSky } from "@/lib/utils";
import { TrendingUp, Flame, Target, Trophy } from "lucide-react";

export default function DashboardPage() {
  const positions = markets.slice(0, 4);
  const recommended = markets.slice(4, 7);
  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={<>Welcome back, <span className="text-gradient">Forecaster</span>.</>}
        description="Your daily prediction hub — open positions, market signals, streak, and ranking."
        right={
          <Link href="/markets">
            <Button>Open markets <TrendingUp className="h-4 w-4" /></Button>
          </Link>
        }
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: SkyCoin, label: "SKY balance", value: "12,480", sub: "+12.4% week" },
          { icon: Target, label: "Accuracy (90d)", value: "68.2%", sub: "Top 7% globally" },
          { icon: Flame, label: "Current streak", value: "5 days", sub: "Day 5 unlock: x1.5" },
          { icon: Trophy, label: "Season rank", value: "#142", sub: "Sage tier" },
        ].map((s) => (
          <div key={s.label} className="glass rounded-2xl p-5">
            <div className="flex items-center gap-2 text-violet-300">
              <s.icon className="h-4 w-4" />
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
            <Badge tone="violet">{positions.length} active</Badge>
          </div>
          <ul className="mt-4 divide-y divide-violet-400/10">
            {positions.map((m) => {
              const side = m.yes >= 50 ? "YES" : "NO";
              return (
                <li key={m.id} className="flex items-center gap-4 py-4">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/markets/${m.id}`}
                      className="block truncate text-sm font-medium hover:text-white"
                    >
                      {m.title}
                    </Link>
                    <p className="truncate text-[11px] text-ink-400">{m.category} · closes {m.closes}</p>
                  </div>
                  <Sparkline data={m.trend} width={80} height={28} className="hidden sm:block" />
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">Side</p>
                    <p className={`font-display text-sm font-bold ${side === "YES" ? "text-success" : "text-danger"}`}>
                      {side} · {side === "YES" ? m.yes : 100 - m.yes}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-wider text-ink-400">Stake</p>
                    <p className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                      <SkyCoin size={14} spin={false} /> {formatSky(500 + (m.participants % 600))}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="space-y-6">
          <div className="glass rounded-3xl p-5">
            <h3 className="font-display text-lg font-semibold">Daily streak</h3>
            <p className="text-xs text-ink-400">Make at least one forecast each day</p>
            <div className="mt-4">
              <StreakStrip />
            </div>
          </div>
          <LeaderboardPreview />
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-lg md:text-xl font-semibold mb-4">Recommended for you</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommended.map((m, i) => (
            <MarketCard key={m.id} m={m} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
