"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Target, Trophy, Award, Settings, Coins } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { SkyCoin } from "@/components/SkyCoin";
import { Card } from "@/components/Card";
import { useAuth } from "@/components/AuthProvider";
import { apiGet } from "@/lib/client";
import { formatSky } from "@/lib/utils";

type Prediction = {
  id: number; market_id: string; market_title: string; category: string;
  side: "YES" | "NO"; stake: number; potential_payout: number;
  status: "open" | "won" | "lost"; created_at: string;
};

export default function ProfilePage() {
  const { user } = useAuth();
  const [preds, setPreds] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<{ predictions: Prediction[] }>("/api/predictions")
      .then(({ predictions }) => setPreds(predictions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const m = useMemo(() => {
    const won = preds.filter((p) => p.status === "won").length;
    const lost = preds.filter((p) => p.status === "lost").length;
    const open = preds.filter((p) => p.status === "open").length;
    const settled = won + lost;
    const accuracy = settled > 0 ? (won / settled) * 100 : 0;
    const profit = preds.reduce((a, p) => a + (p.status === "won" ? p.potential_payout - p.stake : p.status === "lost" ? -p.stake : 0), 0);
    const tier = profit >= 100_000 && accuracy >= 70 && settled >= 10 ? "Oracle" : profit >= 25_000 ? "Sage" : settled > 0 ? "Analyst" : "Rookie";
    return { won, lost, open, settled, accuracy, profit, tier, total: preds.length };
  }, [preds]);

  const badges = [
    { name: "First forecast", earned: m.total >= 1 },
    { name: "First win", earned: m.won >= 1 },
    { name: "5 predictions", earned: m.total >= 5 },
    { name: "70%+ accuracy", earned: m.settled >= 3 && m.accuracy >= 70 },
    { name: "10 wins", earned: m.won >= 10 },
    { name: "Oracle tier", earned: m.tier === "Oracle" },
  ];
  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={<>Your <span className="text-gradient">prediction</span> identity.</>}
        description="Track your real progression, accuracy, badges, and history across SKYLONZE."
        right={<Link href="/settings"><Button variant="secondary" size="sm"><Settings className="h-4 w-4" /> Edit</Button></Link>}
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 lg:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="gradient-border p-1">
          <div className="relative rounded-2xl bg-bg-800/80 p-6 text-center">
            <div className="mx-auto w-fit"><Avatar seed={user?.avatar_seed || user?.handle || "you"} size={96} /></div>
            <h2 className="mt-4 font-display text-xl font-bold">{user?.name || "Forecaster"}</h2>
            <p className="text-xs text-ink-400">@{user?.handle || "you"}</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="pink">{m.tier}</Badge>
              <Badge tone="violet">Season 01</Badge>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <Stat icon={Coins} label="Balance" value={user ? formatSky(user.sky_balance) : "—"} />
              <Stat icon={Target} label="Accuracy" value={`${m.accuracy.toFixed(0)}%`} />
              <Stat icon={Award} label="Badges" value={`${earnedCount}/${badges.length}`} />
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <Card variant="glass">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Realized profit</p>
            <p className={`mt-1 font-display text-3xl font-bold tabular ${m.profit >= 0 ? "text-gradient" : "text-danger"}`}>
              {m.profit >= 0 ? "+" : ""}{formatSky(m.profit)}
            </p>
            <p className="mt-2 text-xs text-ink-400">{m.settled} settled · {m.open} open</p>
          </Card>
          <Card variant="glass">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Win / Loss</p>
            <p className="mt-1 font-display text-3xl font-bold tabular text-gradient">{m.won} / {m.lost}</p>
            <p className="mt-2 text-xs text-ink-400">{m.accuracy.toFixed(1)}% accuracy</p>
          </Card>
          <Card variant="glass" className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-display text-base font-semibold">Badges</p>
              <span className="text-xs text-ink-400">{earnedCount} of {badges.length} earned</span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div key={b.name} className={`flex items-center gap-2 rounded-2xl border p-3 ${b.earned ? "border-violet-400/40 bg-gradient-to-br from-violet-500/15 to-bg-700/40" : "border-violet-400/15 bg-white/[0.02]"}`}>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${b.earned ? "bg-gradient-to-br from-violet-500 to-neon-pink text-white shadow-glow" : "bg-bg-700 text-ink-400"}`}>
                    <Award className="h-4 w-4" />
                  </span>
                  <span className="text-sm">{b.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-7xl px-4 sm:px-6">
        <h2 className="font-display text-lg md:text-xl font-semibold mb-4">Your forecasts</h2>
        <div className="glass rounded-3xl overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-sm text-ink-400">Loading…</div>
          ) : preds.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-ink-300">No forecasts yet.</p>
              <Link href="/markets"><Button className="mt-4" size="sm">Make your first prediction</Button></Link>
            </div>
          ) : (
            <ul className="divide-y divide-violet-400/10">
              {preds.map((p) => (
                <li key={p.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-violet-400/20"><SkyCoin size={20} /></div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/markets/${p.market_id}`} className="block truncate text-sm font-medium hover:text-white">{p.market_title}</Link>
                    <p className="text-[11px] text-ink-400">{p.category} · {new Date(p.created_at).toLocaleDateString()}</p>
                  </div>
                  <span className={`font-display text-sm font-bold ${p.side === "YES" ? "text-success" : "text-danger"}`}>{p.side}</span>
                  <span className="inline-flex items-center gap-1 text-xs tabular text-ink-300"><SkyCoin size={12} /> {formatSky(p.stake)}</span>
                  <Badge tone={p.status === "won" ? "success" : p.status === "lost" ? "danger" : "neutral"}>{p.status}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </>
  );
}

function Stat({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-violet-300" />
      <p className="text-[10px] uppercase tracking-wider text-ink-400">{label}</p>
      <p className="font-display text-sm font-bold tabular">{value}</p>
    </div>
  );
}
