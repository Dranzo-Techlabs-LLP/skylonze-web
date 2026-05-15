"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Globe2, Lock, Zap, Layers } from "lucide-react";

const pillars = [
  { icon: ShieldCheck, title: "Fair & Transparent", text: "On-chain verified markets." },
  { icon: Globe2, title: "Global Community", text: "Join a world of smart predictors & investors." },
  { icon: Lock, title: "Secure & Trustless", text: "Your assets. Your control." },
  { icon: Zap, title: "Fast & Seamless", text: "Real-time markets. Instant opportunities." },
  { icon: Layers, title: "Built for the Future", text: "Scalable, innovative, community-driven." },
];

export function PillarsRow() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="group relative overflow-hidden rounded-2xl border border-violet-400/20 bg-bg-800/60 p-4 hover:border-violet-400/50 transition"
          >
            <div className="pointer-events-none absolute -right-6 -bottom-8 h-24 w-24 rounded-full bg-violet-500/15 blur-2xl opacity-60 group-hover:opacity-100 transition" />
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10">
              <p.icon className="h-4 w-4 text-violet-200" />
            </span>
            <h4 className="mt-3 font-display text-xs font-bold uppercase tracking-[0.16em] text-white">
              {p.title}
            </h4>
            <p className="mt-1 text-[11px] text-ink-300 leading-snug">{p.text}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
