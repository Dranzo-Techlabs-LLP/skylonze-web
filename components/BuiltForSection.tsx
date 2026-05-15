"use client";
import { motion } from "framer-motion";
import {
  TrendingUp, Rocket, Coins, Users, BarChart3, Crown,
  ShieldCheck, Activity, Lock,
} from "lucide-react";
import { Section } from "./Section";
import { DashboardMockup } from "./DashboardMockup";

const props = [
  { icon: TrendingUp, t: "Real Markets.", s: "Real Outcomes." },
  { icon: Users, t: "Community Driven.", s: "Reputation Powered." },
  { icon: Rocket, t: "Startups Today.", s: "Unicorns Tomorrow." },
  { icon: BarChart3, t: "Advanced Analytics.", s: "Smarter Decisions." },
  { icon: Coins, t: "Digital Assets.", s: "Real Ownership." },
  { icon: Crown, t: "Earn. Grow.", s: "Stay Ahead." },
];

const trust = [
  { icon: ShieldCheck, label: "Secure", text: "Your assets. Your control." },
  { icon: Activity, label: "Transparent", text: "On-chain verified and provable." },
  { icon: Lock, label: "Trusted", text: "Built for the global community." },
];

export function BuiltForSection() {
  return (
    <Section id="built-for" className="overflow-hidden">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Left copy */}
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-6xl font-bold leading-[0.95] uppercase"
          >
            <span className="block text-white">Built For</span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="block text-gradient"
            >
              Predictors.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="block text-gradient"
            >
              Investors.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="block text-gradient"
            >
              Builders.
            </motion.span>
          </motion.h2>

          <p className="mt-6 max-w-xl text-ink-200/90">
            SKYLONZE is the all‑in‑one ecosystem where prediction markets,
            startup investing, digital assets, and community intelligence come
            together to create new opportunities.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {props.map((p, i) => (
              <motion.div
                key={p.t}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/15">
                  <p.icon className="h-4 w-4 text-violet-200" />
                </span>
                <div>
                  <p className="font-display text-xs font-bold uppercase tracking-[0.16em] text-white">
                    {p.t}
                  </p>
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-violet-300">
                    {p.s}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* trust strip */}
          <div className="mt-8 grid grid-cols-3 gap-3">
            {trust.map((t) => (
              <div key={t.label} className="glass rounded-2xl p-3">
                <t.icon className="h-4 w-4 text-success" />
                <p className="mt-2 font-display text-[10px] font-bold uppercase tracking-[0.18em]">
                  {t.label}
                </p>
                <p className="mt-0.5 text-[10px] text-ink-300 leading-snug">{t.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right mockup */}
        <div className="relative">
          <div className="pointer-events-none absolute inset-0 -z-10 mx-auto h-full w-[80%] rounded-full bg-violet-500/15 blur-3xl" />
          <DashboardMockup />
        </div>
      </div>
    </Section>
  );
}
