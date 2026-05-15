"use client";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";

export function StatPill({
  label,
  value,
  suffix = "",
  prefix = "",
  decimals = 0,
}: {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const mv = useMotionValue(0);
  const out = useTransform(mv, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, value, { duration: 1.4, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [inView, value, mv]);

  return (
    <div ref={ref} className="glass rounded-2xl px-4 py-3 min-w-[140px]">
      <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">{label}</p>
      <motion.p className="font-display text-xl font-bold tabular text-gradient">{out}</motion.p>
    </div>
  );
}
