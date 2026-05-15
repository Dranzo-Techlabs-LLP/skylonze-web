"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  BarChart3, PieChart, Users, Star, Rocket, Globe2,
} from "lucide-react";

type Item = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

const items: Item[] = [
  { icon: BarChart3, label: "Total Volume", value: 24.8, prefix: "$", suffix: "M+", decimals: 1 },
  { icon: PieChart, label: "Active Markets", value: 1284, suffix: "+" },
  { icon: Users, label: "Users", value: 86, suffix: "K+" },
  { icon: Star, label: "Predictors", value: 50, suffix: "K+" },
  { icon: Rocket, label: "Startups", value: 200, suffix: "+" },
  { icon: Globe2, label: "Countries", value: 100, suffix: "+" },
];

function Counter({ value, prefix = "", suffix = "", decimals = 0 }: Omit<Item, "icon" | "label">) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const out = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);
  useEffect(() => {
    if (inView) {
      const c = animate(mv, value, { duration: 1.4, ease: "easeOut" });
      return () => c.stop();
    }
  }, [inView, value, mv]);
  return (
    <motion.span ref={ref} className="font-display text-2xl md:text-3xl font-bold tabular text-gradient">
      {out}
    </motion.span>
  );
}

export function StatsBand() {
  return (
    <section className="relative mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="glass-strong rounded-3xl overflow-hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-y sm:divide-y-0 divide-violet-400/15">
          {items.map((it, i) => (
            <motion.div
              key={it.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="flex items-center gap-3 p-5"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-400/30">
                <it.icon className="h-5 w-5 text-violet-200" />
              </span>
              <div>
                <Counter value={it.value} prefix={it.prefix} suffix={it.suffix} decimals={it.decimals} />
                <p className="text-[10px] uppercase tracking-[0.16em] text-ink-400">{it.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
