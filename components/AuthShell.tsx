"use client";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Logo } from "./Logo";
import { ShieldCheck, Sparkles, Trophy } from "lucide-react";

const MiniOrb = dynamic(() => import("./MiniOrb").then((m) => m.MiniOrb), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-3xl bg-violet-700/20 animate-pulse" />,
});

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[1000px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl gap-10 px-4 py-10 sm:px-6 md:py-16 lg:grid-cols-2 lg:items-center">
        {/* Left visual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative hidden lg:block"
        >
          <div className="gradient-border p-1">
            <div className="relative rounded-2xl bg-bg-800/80 p-8 min-h-[560px] overflow-hidden">
              <Logo />
              <h2 className="mt-6 font-display text-3xl font-bold leading-tight">
                Predict <span className="text-gradient">everything</span>.<br />
                From crypto to startups.
              </h2>
              <ul className="mt-6 space-y-3 text-sm text-ink-200/90">
                <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-neon-pink" /> 500 starter SKY-3030 on signup</li>
                <li className="flex items-center gap-2"><Trophy className="h-4 w-4 text-violet-300" /> Compete in Season 01 leaderboard</li>
                <li className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-success" /> Virtual ecosystem — no real money risk</li>
              </ul>
              <div className="absolute -right-10 -bottom-10 h-[340px] w-[340px]">
                <MiniOrb className="h-full w-full" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="glass-strong rounded-3xl p-6 sm:p-8"
        >
          <div className="lg:hidden mb-4">
            <Logo />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-ink-300">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}
