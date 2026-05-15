"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Flame, Users, TrendingUp } from "lucide-react";
import type { Market } from "@/lib/data";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { ProbabilityBar } from "./ProbabilityBar";
import { Sparkline } from "./Sparkline";
import { SkyCoin } from "./SkyCoin";
import { formatSky } from "@/lib/utils";

export function MarketCard({ m, index = 0 }: { m: Market; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Link href={`/markets/${m.id}`} className="block">
        <Card interactive className="group">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <Badge tone="violet">{m.category}</Badge>
                {m.hot && (
                  <Badge tone="pink" className="gap-1">
                    <Flame className="h-3 w-3" /> Hot
                  </Badge>
                )}
              </div>
              <h3 className="font-display text-base font-semibold leading-tight">
                {m.title}
              </h3>
              <p className="text-xs text-ink-400 line-clamp-2">{m.question}</p>
            </div>
            <Sparkline data={m.trend} width={92} height={32} className="shrink-0 opacity-90" />
          </div>

          <div className="my-4">
            <ProbabilityBar yes={m.yes} />
          </div>

          <div className="flex items-center justify-between text-[11px] text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {m.participants.toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1.5 tabular">
              <SkyCoin size={14} spin={false} /> {formatSky(m.volume)} vol
            </span>
            <span className="inline-flex items-center gap-1.5">
              <TrendingUp className="h-3.5 w-3.5" /> {m.closes}
            </span>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
