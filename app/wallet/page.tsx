"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowDownLeft, ArrowUpRight, Gift, TrendingUp, TrendingDown } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { SkyCoin } from "@/components/SkyCoin";
import { Sparkline } from "@/components/Sparkline";
import { Badge } from "@/components/Badge";
import { formatSky } from "@/lib/utils";

const MiniOrb = dynamic(() => import("@/components/MiniOrb").then((m) => m.MiniOrb), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-3xl bg-violet-700/20 animate-pulse" />,
});

const txns = [
  { id: 1, type: "in", title: "Forecast payout · NVDA $5T", amount: 1240, time: "2h ago" },
  { id: 2, type: "out", title: "Stake · BTC ≥ $150K", amount: 500, time: "3h ago" },
  { id: 3, type: "in", title: "Streak bonus · Day 4", amount: 180, time: "yesterday" },
  { id: 4, type: "out", title: "Stake · Spain wins Euro", amount: 250, time: "2d ago" },
  { id: 5, type: "in", title: "Referral · @lyraq joined", amount: 500, time: "3d ago" },
  { id: 6, type: "in", title: "Welcome pack", amount: 5000, time: "Apr 02" },
];

const portfolioTrend = [10, 12, 11, 14, 16, 18, 17, 19, 22, 24, 23, 26];

export default function WalletPage() {
  return (
    <>
      <PageHeader
        eyebrow="SKY-3030 wallet"
        title={<>Your <span className="text-gradient">prediction</span> economy.</>}
        description="A self-custody-style ledger for SKY-3030. Track balance, growth, stakes, payouts, and rewards."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 lg:grid-cols-3">
        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 gradient-border p-1 overflow-hidden"
        >
          <div className="relative rounded-2xl bg-bg-800/80 p-6 sm:p-8 grid items-center gap-6 sm:grid-cols-2 min-h-[260px]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Balance</p>
              <div className="mt-2 flex items-center gap-3">
                <SkyCoin size={48} />
                <div>
                  <p className="font-display text-4xl sm:text-5xl font-bold tabular text-gradient">
                    12,480
                  </p>
                  <p className="text-xs text-ink-400">SKY-3030</p>
                </div>
              </div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm text-success">
                <TrendingUp className="h-4 w-4" /> +12.4% this week
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button size="sm"><ArrowDownLeft className="h-4 w-4" /> Receive</Button>
                <Button size="sm" variant="secondary"><ArrowUpRight className="h-4 w-4" /> Send</Button>
                <Button size="sm" variant="secondary"><Gift className="h-4 w-4" /> Gift</Button>
              </div>
            </div>
            <div className="relative h-44 sm:h-56">
              <MiniOrb className="h-full w-full" />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {[
            { label: "Open stakes", value: "4,250", sub: "8 markets" },
            { label: "Pending payouts", value: "1,820", sub: "3 markets" },
            { label: "Lifetime earned", value: "62,310", sub: "Since Apr 02" },
            { label: "Streak bonus", value: "+260", sub: "Day 5 unlock" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className="mt-1 font-display text-xl font-bold tabular text-gradient">
                {s.value}
              </p>
              <p className="text-[11px] text-ink-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Portfolio chart */}
        <div className="lg:col-span-2 glass rounded-3xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Portfolio</p>
              <p className="font-display text-2xl font-bold tabular text-gradient">+26.1%</p>
            </div>
            <Badge tone="success">Outperforming median</Badge>
          </div>
          <div className="mt-4">
            <Sparkline data={portfolioTrend} width={800} height={120} className="w-full h-auto" />
          </div>
        </div>

        {/* Transactions */}
        <div className="glass rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-violet-400/15">
            <h3 className="font-display text-lg font-semibold">Recent activity</h3>
          </div>
          <ul className="divide-y divide-violet-400/10 max-h-[420px] overflow-auto">
            {txns.map((t) => {
              const inflow = t.type === "in";
              return (
                <li key={t.id} className="flex items-center gap-3 p-4">
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                      inflow ? "bg-success/15 text-success" : "bg-danger/15 text-danger"
                    }`}
                  >
                    {inflow ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{t.title}</p>
                    <p className="text-[11px] text-ink-400">{t.time}</p>
                  </div>
                  <span className={`font-display tabular text-sm font-bold ${inflow ? "text-success" : "text-danger"}`}>
                    {inflow ? "+" : "-"}{formatSky(t.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
