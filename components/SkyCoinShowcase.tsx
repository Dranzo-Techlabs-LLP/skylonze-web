"use client";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Users, Boxes, Globe2, ShieldCheck } from "lucide-react";
import { Section } from "./Section";
import { SkyCoin } from "./SkyCoin";

const pillars = [
  { icon: Users, title: "Peer to Peer", desc: "Built for a global community." },
  { icon: Boxes, title: "Decentralised", desc: "Secure. Transparent. Community-driven." },
  { icon: Globe2, title: "Digital Currency", desc: "Borderless. Fast. Built for scale." },
  { icon: ShieldCheck, title: "Trusted System", desc: "Designed for security and reliability." },
];

export function SkyCoinShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const yCoin = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : 80, reduce ? 0 : -80]);
  const rot = useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -8, reduce ? 0 : 12]);

  return (
    <Section id="sky-3030" className="overflow-hidden">
      <div ref={ref} className="grid items-center gap-12 lg:grid-cols-2">
        {/* Coin */}
        <motion.div
          style={{ y: yCoin, rotate: rot }}
          className="relative mx-auto h-[360px] w-[360px] sm:h-[460px] sm:w-[460px]"
        >
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-violet-500/30 blur-3xl" />
          <motion.div
            animate={reduce ? undefined : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <SkyCoin size={460} spin={false} />
          </motion.div>

          {/* second stacked coin behind */}
          <motion.div
            initial={{ opacity: 0, y: 30, rotate: -8 }}
            whileInView={{ opacity: 0.7, y: 60, rotate: -10 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="absolute -bottom-10 -left-12 h-44 w-44 sm:h-60 sm:w-60 -z-10"
          >
            <SkyCoin size={240} spin={false} />
          </motion.div>
        </motion.div>

        {/* Copy */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300"
          >
            Native digital asset
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-2 font-display text-5xl md:text-7xl font-bold leading-[1] tracking-tight uppercase"
          >
            <span className="text-white">SKY‑</span>
            <span className="text-gradient">3030</span>
          </motion.h2>
          <p className="mt-3 font-display text-xs sm:text-sm font-semibold tracking-[0.32em] uppercase text-ink-200">
            The Future. In Your Hands.
          </p>
          <p className="mt-6 max-w-xl text-ink-200/90">
            SKY‑3030 is the native digital asset of the SKYLONZE ecosystem.
            A peer‑to‑peer, decentralised virtual currency built for the future
            of prediction, investing, and rewards.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-3">
            {pillars.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="glass rounded-2xl p-4"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/30 bg-white/5">
                  <p.icon className="h-4 w-4 text-violet-300" />
                </span>
                <h4 className="mt-3 font-display text-xs font-bold uppercase tracking-[0.16em]">
                  {p.title}
                </h4>
                <p className="mt-1 text-xs text-ink-300">{p.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/5 px-4 py-2 text-xs"
          >
            <span className="font-display font-semibold tracking-[0.22em] uppercase text-white">
              One Ecosystem.
            </span>
            <span className="text-gradient font-display font-semibold tracking-[0.22em] uppercase">
              Limitless Possibilities.
            </span>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
