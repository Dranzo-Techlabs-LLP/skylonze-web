"use client";
import { motion } from "framer-motion";
import {
  TrendingUp, Rocket, Coins, Trophy, BarChart3, Sparkles,
} from "lucide-react";
import { Section } from "./Section";

const steps = [
  {
    n: "01",
    icon: TrendingUp,
    title: "Predict Markets",
    desc: "Forecast real-world events across finance, crypto, business, sports, tech, and more. Turn insights into rewards.",
  },
  {
    n: "02",
    icon: Rocket,
    title: "Discover Startups",
    desc: "Explore innovative startups from around the world. Analyze, follow, and back the ones you believe will shape the future.",
  },
  {
    n: "03",
    icon: Coins,
    title: "Invest with Digital Assets",
    desc: "Use SKY-3030 to allocate across startups and markets. Simple, secure, borderless.",
  },
  {
    n: "04",
    icon: Trophy,
    title: "Compete & Climb Leaderboards",
    desc: "Compete with top predictors and investors. Climb the leaderboards and earn exclusive rewards.",
  },
  {
    n: "05",
    icon: BarChart3,
    title: "Powerful Insights",
    desc: "Get real-time market data, sentiment trends, and advanced analytics to make smarter decisions.",
  },
  {
    n: "06",
    icon: Sparkles,
    title: "Earn. Grow. Repeat.",
    desc: "Earn rewards, grow your reputation, unlock achievements, and become a key part of the SKYLONZE ecosystem.",
  },
];

export function WhatIsSkylonze() {
  return (
    <Section id="what-is">
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-4"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            What is
          </p>
          <h2 className="mt-2 font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-[1] uppercase">
            <span className="text-white">SKYL</span>
            <span className="text-gradient">ONZE?</span>
          </h2>
          <div className="mt-4 h-px w-24 bg-gradient-to-r from-violet-400/80 to-transparent" />
          <p className="mt-6 text-ink-200/90">
            A next-generation intelligence ecosystem where people predict the
            future, discover and invest in startups, and grow in a digital
            economy built on skills, insights, and community.
          </p>
          <p className="mt-6 font-display text-base font-semibold uppercase tracking-[0.18em]">
            <span className="text-neon-pink">One Platform.</span>{" "}
            <span className="text-violet-300">Endless Possibilities.</span>
          </p>
        </motion.div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {steps.map((s, i) => (
            <motion.article
              key={s.n}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -4 }}
              className="group relative overflow-hidden rounded-2xl border border-violet-400/20 bg-gradient-to-br from-bg-700/70 to-bg-900/70 p-5"
            >
              <div className="absolute -right-6 -top-6 h-28 w-28 rounded-full bg-violet-500/15 blur-2xl group-hover:bg-violet-500/30 transition" />
              <div className="flex items-start justify-between">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/40 bg-violet-500/15 font-display text-xs font-bold text-violet-200">
                  {s.n}
                </span>
                <s.icon className="h-5 w-5 text-violet-300 opacity-80" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold uppercase tracking-wide">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-ink-300">{s.desc}</p>
              <div className="mt-4 h-px w-12 bg-gradient-to-r from-neon-pink to-violet-400 transition-all group-hover:w-24" />
            </motion.article>
          ))}
        </div>
      </div>
    </Section>
  );
}
