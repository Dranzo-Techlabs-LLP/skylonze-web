"use client";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ChevronRight, ShieldCheck, Activity, Globe2 } from "lucide-react";
import { Button } from "./Button";
import { StatPill } from "./StatPill";
import { SkyCoin } from "./SkyCoin";
import { CitySilhouette } from "./CitySilhouette";
import { PortalPedestal } from "./PortalPedestal";
import { MagneticButton } from "./MagneticButton";
import { apiGet } from "@/lib/client";
import type { PlatformStats } from "@/lib/stats";
import { useAuth } from "./AuthProvider";

const HeroScene = dynamic(() => import("./HeroScene").then((m) => m.HeroScene), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full rounded-3xl bg-gradient-to-br from-violet-700/30 to-bg-900 animate-pulse" />
  ),
});

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const { user } = useAuth();
  useEffect(() => {
    apiGet<PlatformStats>("/api/stats").then(setStats).catch(() => {});
  }, []);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yOrb = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -120]);
  const yCity = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 60]);
  const yCopy = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -40]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.85], [1, 0.55]);

  return (
    <section ref={ref} className="relative overflow-hidden isolate">
      {/* layered backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute -top-40 left-1/2 h-[820px] w-[1200px] -translate-x-1/2 rounded-full bg-violet-radial blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-50" />
        <motion.div
          initial={{ y: "-30%", opacity: 0 }}
          animate={reduce ? undefined : { y: ["-30%", "130%"], opacity: [0, 0.45, 0] }}
          transition={{ duration: 6.5, repeat: Infinity, ease: "linear" }}
          className="absolute left-0 right-0 h-[140px]"
          style={{
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(168,123,255,0.18) 45%, rgba(255,255,255,0.06) 50%, rgba(168,123,255,0.18) 55%, transparent 100%)",
            mixBlendMode: "screen",
            filter: "blur(2px)",
          }}
        />
      </div>

      {/* city skyline parallax */}
      <motion.div
        style={{ y: yCity }}
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[360px]"
        aria-hidden
      >
        <CitySilhouette className="absolute inset-0 h-full w-full" />
      </motion.div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 pt-10 md:pt-16 pb-16 md:pb-24">
        {/* top status row */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/5 px-3 py-1.5 text-xs font-medium"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-success/70" />
              <span className="relative h-2 w-2 rounded-full bg-success" />
            </span>
            <span className="text-ink-100 tracking-wider uppercase">Platform Live</span>
            <span className="text-ink-400">· Global Access</span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden sm:flex items-center gap-3 text-[11px] text-ink-400"
          >
            <span className="inline-flex items-center gap-1"><Activity className="h-3.5 w-3.5" /> {stats?.activeMarkets ?? 0} active markets</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Globe2 className="h-3.5 w-3.5" /> {stats?.predictors ?? 0} predictors</span>
          </motion.div>
        </div>

        <div className="grid items-center gap-10 lg:grid-cols-12">
          {/* Copy */}
          <motion.div style={{ y: yCopy, opacity: opacityFade }} className="lg:col-span-7 space-y-7">
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="font-display text-5xl md:text-7xl lg:text-[88px] font-bold leading-[0.95] tracking-tight uppercase"
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.6 }}
                className="block text-white"
              >
                The Future
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.6 }}
                className="block text-white"
              >
                Has a
              </motion.span>
              <motion.span
                initial={{ opacity: 0, y: 20, letterSpacing: "0.15em" }}
                animate={{ opacity: 1, y: 0, letterSpacing: "-0.01em" }}
                transition={{ delay: 0.32, duration: 0.8 }}
                className="block text-gradient"
                style={{ filter: "drop-shadow(0 0 28px rgba(168,123,255,0.45))" }}
              >
                Market.
              </motion.span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="max-w-xl text-base md:text-lg text-ink-200/90"
            >
              <span className="font-semibold text-violet-300">SKYLONZE</span> unites prediction markets,
              startup investing, digital assets, and community intelligence into one
              futuristic ecosystem — powered by <span className="font-semibold text-white">SKY‑3030</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="flex flex-wrap items-center gap-3"
            >
              {user && user.bonus_granted ? (
                <MagneticButton href="/dashboard">
                  <Button size="lg">
                    Open dashboard <ChevronRight className="h-4 w-4" />
                  </Button>
                </MagneticButton>
              ) : user ? (
                <MagneticButton href="/settings">
                  <Button size="lg">
                    Verify email <ChevronRight className="h-4 w-4" />
                  </Button>
                </MagneticButton>
              ) : (
                <MagneticButton href="/signup">
                  <Button size="lg">
                    Claim 500 SKY <ChevronRight className="h-4 w-4" />
                  </Button>
                </MagneticButton>
              )}
              <Link href="/startups">
                <Button variant="secondary" size="lg">Explore startups</Button>
              </Link>
              <div className="ml-1 inline-flex items-center gap-2 text-xs text-ink-400">
                <ShieldCheck className="h-4 w-4 text-success" />
                <span>Powered by SKY‑3030 · Virtual ecosystem</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 pt-2"
            >
              <StatPill label="Total volume" value={stats ? stats.volume / 1_000_000 : 0} prefix="$" suffix="M" decimals={2} />
              <StatPill label="Active markets" value={stats?.activeMarkets ?? 0} />
              <StatPill label="Forecasters" value={stats?.users ?? 0} />
              <StatPill label="Win rate" value={stats?.winRate ?? 0} suffix="%" decimals={1} />
            </motion.div>
          </motion.div>

          {/* 3D + portal */}
          <motion.div
            style={{ y: yOrb }}
            className="lg:col-span-5 relative h-[480px] sm:h-[560px] lg:h-[640px]"
          >
            <div className="absolute inset-0 -bottom-10">
              <HeroScene className="h-full w-full" />
            </div>

            <div className="absolute inset-x-0 bottom-0">
              <PortalPedestal className="h-40 sm:h-48" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20, rotate: -4 }}
              animate={{ opacity: 1, y: 0, rotate: -4 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ y: -4, rotate: -2 }}
              className="absolute left-2 top-6 sm:left-6 sm:top-10 glass rounded-2xl px-4 py-3 shadow-glow"
            >
              <div className="flex items-center gap-3">
                <SkyCoin size={32} />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-ink-400">SKY‑3030</p>
                  <p className="font-display text-lg font-bold tabular text-gradient">+12.4%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              whileHover={{ y: -4, rotate: 3 }}
              className="absolute right-2 bottom-24 sm:right-6 sm:bottom-32 glass rounded-2xl px-4 py-3 shadow-glow-pink"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-400">BTC ≥ $150K</p>
              <p className="font-display text-lg font-bold tabular text-gradient">YES 62%</p>
              <div className="mt-1 h-1 w-32 rounded-full bg-bg-700">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "62%" }}
                  transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: "linear-gradient(90deg,#7BEAFF,#A87BFF)" }}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.04 }}
              className="absolute right-4 top-4 sm:right-10 sm:top-12 glass rounded-2xl px-3 py-2"
            >
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Streak</p>
              <p className="font-display text-base font-bold text-neon-pink">7d · Oracle</p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* tagline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative pb-10"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <p className="font-display text-xs md:text-sm font-semibold tracking-[0.45em] text-ink-300 uppercase">
            <span className="text-white">The Future</span> <span className="text-violet-300">Starts</span> <span className="text-gradient">Now.</span>
          </p>
          <div className="mx-auto mt-3 h-px w-1/2 bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
        </div>
      </motion.div>
    </section>
  );
}
