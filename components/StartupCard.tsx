"use client";
import { motion } from "framer-motion";
import { TrendingUp, Users } from "lucide-react";
import type { Startup } from "@/lib/data";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { SkyCoin } from "./SkyCoin";
import { Button } from "./Button";
import { formatSky } from "@/lib/utils";

function Logo({ seed }: { seed: string }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rot = h % 360;
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30"
      style={{
        background: `conic-gradient(from ${rot}deg, #C5A6FF, #FF7BD5, #7BEAFF, #C5A6FF)`,
        boxShadow: "0 0 18px rgba(168,123,255,0.35)",
      }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-900 font-display text-sm font-bold text-gradient">
        {seed.slice(0, 1).toUpperCase()}
      </span>
    </div>
  );
}

export function StartupCard({ s, index = 0 }: { s: Startup; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
    >
      <Card interactive className="h-full">
        <div className="flex items-start gap-4">
          <Logo seed={s.logoSeed} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-base font-semibold truncate">{s.name}</h3>
              <Badge tone="cyan" className="hidden sm:inline-flex">{s.sector}</Badge>
            </div>
            <p className="mt-1 text-xs text-ink-300 line-clamp-2">{s.pitch}</p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Raised</p>
            <p className="font-display text-sm font-bold tabular">${formatSky(s.raised)}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Valuation</p>
            <p className="font-display text-sm font-bold tabular">${formatSky(s.valuation)}</p>
          </div>
          <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
            <p className="text-[10px] uppercase tracking-wider text-ink-400">Growth</p>
            <p className="inline-flex items-center justify-center gap-1 font-display text-sm font-bold tabular text-success">
              <TrendingUp className="h-3 w-3" /> +{s.growth}%
            </p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 text-xs text-ink-400">
            <Users className="h-3.5 w-3.5" /> Founders: {s.founders}
          </span>
          <Button size="sm" variant="secondary">
            <SkyCoin size={14} spin={false} /> Back
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
