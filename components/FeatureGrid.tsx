"use client";
import { motion } from "framer-motion";
import {
  Bitcoin, LineChart, Trophy, Cpu, Rocket, Flame,
  Wallet, ShieldCheck, Brain, Layers,
} from "lucide-react";
import { Card } from "./Card";

const items = [
  {
    icon: Bitcoin,
    title: "Crypto markets",
    desc: "Forecast BTC, ETH, L1s and on-chain narratives in real time.",
    tint: "from-violet-500/30 to-violet-500/0",
  },
  {
    icon: LineChart,
    title: "Stocks & macro",
    desc: "Index targets, earnings beats, IPO debuts, macro prints.",
    tint: "from-neon-cyan/30 to-violet-500/0",
  },
  {
    icon: Trophy,
    title: "Sports outcomes",
    desc: "From championship runs to single-match props.",
    tint: "from-neon-pink/30 to-violet-500/0",
  },
  {
    icon: Cpu,
    title: "Technology",
    desc: "Product launches, AI milestones, regulatory moves.",
    tint: "from-violet-500/30 to-neon-cyan/0",
  },
  {
    icon: Rocket,
    title: "Startup investing",
    desc: "Crowd-rated private rounds with virtual SKY positions.",
    tint: "from-neon-pink/30 to-violet-500/0",
  },
  {
    icon: Flame,
    title: "Trending & viral",
    desc: "Real-time markets on internet culture and breaking events.",
    tint: "from-violet-500/30 to-neon-pink/0",
  },
];

const pillars = [
  { icon: Wallet, title: "SKY-3030 wallet", text: "Self-custody-style ledger. Earn, spend, stake, gift." },
  { icon: Brain, title: "Prediction intelligence", text: "Personal accuracy, calibration, and edge metrics." },
  { icon: Layers, title: "Composable markets", text: "Categories, filters, watchlists, alerts, deep links." },
  { icon: ShieldCheck, title: "No casino vibes", text: "Innovation-first design. No gambling motifs." },
];

export function FeatureGrid() {
  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="group h-full" interactive>
              <div className={`absolute inset-0 -z-10 bg-gradient-to-br ${it.tint} opacity-50 transition-opacity group-hover:opacity-80`} />
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/30 bg-white/5">
                  <it.icon className="h-5 w-5 text-violet-300" />
                </span>
                <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              </div>
              <p className="mt-3 text-sm text-ink-200/90">{it.desc}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="glass rounded-2xl p-5"
          >
            <p.icon className="h-5 w-5 text-neon-pink mb-3" />
            <h4 className="font-display text-sm font-semibold">{p.title}</h4>
            <p className="mt-1 text-xs text-ink-300">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
