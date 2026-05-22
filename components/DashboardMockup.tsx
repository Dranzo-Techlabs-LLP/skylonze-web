"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, LineChart, Rocket, Wallet, Trophy, BarChart3, Users, Bell } from "lucide-react";
import { SLogo } from "./SLogo";

export function DashboardMockup() {
  return (
    <div className="relative w-full">
      {/* Laptop frame */}
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{ transformStyle: "preserve-3d", perspective: 1200 }}
        className="relative mx-auto w-full max-w-[640px]"
      >
        <div className="gradient-border p-[1.5px]">
          <div className="relative rounded-[18px] bg-bg-900 overflow-hidden">
            {/* top bar */}
            <div className="flex items-center justify-between border-b border-violet-400/15 bg-bg-800/80 px-4 py-2">
              <div className="flex items-center gap-2">
                <SLogo size={20} />
                <span className="font-display text-xs font-bold tracking-[0.12em] uppercase text-white">Skyl<span className="text-gradient">onze</span></span>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/5 px-2 py-1 text-[10px]">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                <span className="text-ink-200 tabular">12,540.25</span>
              </div>
            </div>

            {/* body */}
            <div className="grid grid-cols-[140px_1fr] min-h-[320px]">
              {/* sidebar */}
              <div className="border-r border-violet-400/15 bg-bg-800/40 p-3 space-y-1 text-[11px]">
                {[
                  { icon: LayoutDashboard, label: "Dashboard", active: true },
                  { icon: LineChart, label: "Markets" },
                  { icon: Rocket, label: "Startups" },
                  { icon: BarChart3, label: "Portfolio" },
                  { icon: Trophy, label: "Leaderboard" },
                  { icon: BarChart3, label: "Analytics" },
                  { icon: Wallet, label: "Wallet" },
                  { icon: Users, label: "Community" },
                ].map((i) => (
                  <div
                    key={i.label}
                    className={`flex items-center gap-2 rounded-lg px-2 py-1.5 ${
                      i.active ? "bg-violet-500/20 text-white" : "text-ink-300"
                    }`}
                  >
                    <i.icon className="h-3.5 w-3.5" />
                    <span>{i.label}</span>
                  </div>
                ))}
              </div>

              {/* main */}
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xs font-semibold uppercase tracking-wider text-ink-200">
                    Market Overview
                  </p>
                  <Bell className="h-3.5 w-3.5 text-ink-400" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { l: "Volume", v: "$24.8M", d: "+18.6%" },
                    { l: "Markets", v: "1,284", d: "+12.3%" },
                    { l: "Users", v: "86,542", d: "+15.7%" },
                    { l: "Win Rate", v: "62.4%", d: "+3.2%" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-lg border border-violet-400/15 bg-white/[0.03] p-2">
                      <p className="text-[8px] uppercase tracking-wider text-ink-400">{s.l}</p>
                      <p className="font-display text-[11px] font-bold tabular text-gradient">{s.v}</p>
                      <p className="text-[8px] text-success tabular">{s.d}</p>
                    </div>
                  ))}
                </div>

                {/* chart */}
                <div className="rounded-lg border border-violet-400/15 bg-white/[0.02] p-3">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-ink-300">Market Trends</span>
                    <span className="text-success tabular">+24.6%</span>
                  </div>
                  <svg viewBox="0 0 300 70" className="mt-1 w-full h-16">
                    <defs>
                      <linearGradient id="mk-stroke" x1="0" x2="1">
                        <stop offset="0" stopColor="#7BEAFF" />
                        <stop offset="1" stopColor="#A87BFF" />
                      </linearGradient>
                      <linearGradient id="mk-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0" stopColor="#A87BFF" stopOpacity="0.4" />
                        <stop offset="1" stopColor="#A87BFF" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <motion.polygon
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      fill="url(#mk-fill)"
                      points="0,70 0,55 25,48 50,52 75,40 100,42 125,30 150,34 175,22 200,28 225,16 250,20 275,10 300,12 300,70"
                    />
                    <motion.polyline
                      initial={{ pathLength: 0 }}
                      whileInView={{ pathLength: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                      fill="none"
                      stroke="url(#mk-stroke)"
                      strokeWidth="1"
                      points="0,55 25,48 50,52 75,40 100,42 125,30 150,34 175,22 200,28 225,16 250,20 275,10 300,12"
                    />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg border border-violet-400/15 bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase text-ink-400 tracking-wider">Featured Market</p>
                    <p className="mt-0.5 text-[10px] text-ink-100">Fed rate hike in June?</p>
                    <div className="mt-1.5 flex items-center justify-between text-[9px]">
                      <span className="text-success">Yes 62%</span>
                      <span className="text-danger">No 38%</span>
                    </div>
                    <div className="mt-1 h-1 rounded-full bg-bg-700 overflow-hidden">
                      <div className="h-full" style={{ width: "62%", background: "linear-gradient(90deg,#7BEAFF,#A87BFF)" }} />
                    </div>
                  </div>
                  <div className="rounded-lg border border-violet-400/15 bg-white/[0.02] p-2.5">
                    <p className="text-[9px] uppercase text-ink-400 tracking-wider">Top Predictors</p>
                    <ul className="mt-1 space-y-0.5 text-[10px]">
                      {["0xVisionary", "FutureSeeker", "MarketMind"].map((n, i) => (
                        <li key={n} className="flex items-center justify-between">
                          <span className="text-ink-200">#{i + 1} {n}</span>
                          <span className="text-ink-400 tabular">{[12540, 9840, 8230][i]}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* base shadow */}
        <div className="mx-auto mt-2 h-2 w-[80%] rounded-full bg-black/60 blur-md" />
      </motion.div>

      {/* phone overlay */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotate: -6 }}
        whileInView={{ opacity: 1, y: 0, rotate: -6 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, delay: 0.15 }}
        className="absolute -bottom-12 -right-2 sm:-right-6 w-[150px] sm:w-[180px]"
      >
        <div className="gradient-border p-[1.5px] rounded-[26px]">
          <div className="rounded-[24px] bg-bg-900 overflow-hidden">
            <div className="flex items-center justify-between border-b border-violet-400/15 bg-bg-800/80 px-3 py-2">
              <div className="flex items-center gap-1.5">
                <SLogo size={14} />
                <span className="font-display text-[9px] font-bold tracking-wider uppercase">Skylonze</span>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
            </div>
            <div className="p-3 space-y-2">
              <div>
                <p className="text-[8px] uppercase text-ink-400 tracking-wider">Total Balance</p>
                <p className="font-display text-sm font-bold tabular text-gradient">$12,540.25</p>
                <p className="text-[8px] text-success tabular">+8.6%</p>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {["Markets", "Startups", "Wallet", "Rewards"].map((l) => (
                  <div key={l} className="rounded-md border border-violet-400/15 bg-white/[0.03] p-1.5">
                    <span className="text-[8px] text-ink-200">{l}</span>
                  </div>
                ))}
              </div>
              <ul className="space-y-1">
                {[
                  { t: "Bitcoin ETF Approval", v: "Yes 68%", c: "text-success" },
                  { t: "ETH Price Above $4K", v: "Yes 57%", c: "text-success" },
                  { t: "Apple Q2 Revenue Beat", v: "No 41%", c: "text-danger" },
                  { t: "SpaceX Next Launch", v: "Yes 73%", c: "text-success" },
                ].map((x) => (
                  <li key={x.t} className="flex items-center justify-between text-[8px]">
                    <span className="truncate text-ink-200">{x.t}</span>
                    <span className={`tabular ${x.c}`}>{x.v}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
