"use client";
import { motion } from "framer-motion";
import { Flame, Target, Trophy, Award, Share2, Settings } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { Sparkline } from "@/components/Sparkline";
import { SkyCoin } from "@/components/SkyCoin";
import { Card } from "@/components/Card";
import { markets } from "@/lib/data";

const accuracyTrend = [55, 58, 60, 62, 63, 65, 66, 68, 69, 70, 70, 71];
const profitTrend = [10, 14, 18, 22, 28, 32, 35, 40, 44, 48, 50, 55];

const badges = [
  { name: "First forecast", earned: true },
  { name: "5-day streak", earned: true },
  { name: "10 correct YES", earned: true },
  { name: "Top 10% accuracy", earned: true },
  { name: "Diamond Oracle", earned: false },
  { name: "Season finalist", earned: false },
];

export default function ProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Profile"
        title={<>Your <span className="text-gradient">prediction</span> identity.</>}
        description="Track your progression, accuracy, badges, and history across SKYLONZE."
        right={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm"><Share2 className="h-4 w-4" /> Share</Button>
            <Button variant="secondary" size="sm"><Settings className="h-4 w-4" /> Edit</Button>
          </div>
        }
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="gradient-border p-1"
        >
          <div className="relative rounded-2xl bg-bg-800/80 p-6 text-center">
            <div className="mx-auto w-fit">
              <Avatar seed="forecaster-you" size={96} />
            </div>
            <h2 className="mt-4 font-display text-xl font-bold">Forecaster · You</h2>
            <p className="text-xs text-ink-400">@you.sky</p>
            <div className="mt-3 flex justify-center gap-2">
              <Badge tone="pink">Sage</Badge>
              <Badge tone="violet">Season 01</Badge>
              <span className="inline-flex items-center gap-1 text-xs text-neon-pink">
                <Flame className="h-3.5 w-3.5" /> 5d
              </span>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <Stat icon={Trophy} label="Rank" value="#142" />
              <Stat icon={Target} label="Acc" value="68.2%" />
              <Stat icon={Award} label="Badges" value="4/12" />
            </div>
            <div className="mt-5 rounded-2xl border border-violet-400/15 bg-white/[0.03] p-3 text-left">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Tier progress</p>
              <p className="mt-1 text-sm">Sage → Oracle</p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-bg-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 1 }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#7BEAFF,#A87BFF,#FF7BD5)" }}
                />
              </div>
              <p className="mt-1 text-[11px] text-ink-400">62% to Oracle</p>
            </div>
          </div>
        </motion.div>

        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <Card variant="glass">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Accuracy (12 mo)</p>
            <p className="mt-1 font-display text-3xl font-bold tabular text-gradient">68.2%</p>
            <Sparkline data={accuracyTrend} width={300} height={70} className="w-full mt-3" />
          </Card>
          <Card variant="glass">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">SKY profit (12 mo)</p>
            <p className="mt-1 font-display text-3xl font-bold tabular text-gradient">+62,310</p>
            <Sparkline data={profitTrend} width={300} height={70} className="w-full mt-3" />
          </Card>
          <Card variant="glass" className="sm:col-span-2">
            <div className="flex items-center justify-between">
              <p className="font-display text-base font-semibold">Badges</p>
              <span className="text-xs text-ink-400">4 of 12 earned</span>
            </div>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`flex items-center gap-2 rounded-2xl border p-3 ${
                    b.earned
                      ? "border-violet-400/40 bg-gradient-to-br from-violet-500/15 to-bg-700/40"
                      : "border-violet-400/15 bg-white/[0.02]"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      b.earned ? "bg-gradient-to-br from-violet-500 to-neon-pink text-white shadow-glow" : "bg-bg-700 text-ink-400"
                    }`}
                  >
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
        <h2 className="font-display text-lg md:text-xl font-semibold mb-4">Recent forecasts</h2>
        <div className="glass rounded-3xl overflow-hidden">
          <ul className="divide-y divide-violet-400/10">
            {markets.slice(0, 6).map((m, i) => {
              const side = m.yes >= 50 ? "YES" : "NO";
              const ok = i % 2 === 0;
              return (
                <li key={m.id} className="flex items-center gap-4 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-violet-400/20">
                    <SkyCoin size={20} spin={false} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{m.title}</p>
                    <p className="text-[11px] text-ink-400">{m.category} · {m.closes}</p>
                  </div>
                  <span className={`font-display text-sm font-bold ${side === "YES" ? "text-success" : "text-danger"}`}>
                    {side}
                  </span>
                  <Badge tone={ok ? "success" : "neutral"}>{ok ? "Pending" : "Resolved"}</Badge>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
      <Icon className="mx-auto mb-1 h-3.5 w-3.5 text-violet-300" />
      <p className="text-[10px] uppercase tracking-wider text-ink-400">{label}</p>
      <p className="font-display text-sm font-bold tabular">{value}</p>
    </div>
  );
}
