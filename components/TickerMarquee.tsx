"use client";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { markets } from "@/lib/data";
import { formatPercent } from "@/lib/utils";

export function TickerMarquee() {
  const items = [...markets, ...markets];
  return (
    <div className="relative w-full overflow-hidden border-y border-violet-400/15 bg-bg-800/50 marquee-mask">
      <motion.div
        className="flex gap-8 py-3 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
      >
        {items.map((m, i) => {
          const last = m.trend[m.trend.length - 1] ?? 0;
          const first = m.trend[0] ?? 0;
          const diff = ((last - first) / first) * 100;
          const up = diff >= 0;
          return (
            <span key={`${m.id}-${i}`} className="inline-flex items-center gap-2 text-sm">
              <span className="text-ink-400 uppercase text-[10px] tracking-wider">{m.category}</span>
              <span className="text-ink-50 font-medium">{m.title}</span>
              <span className={up ? "text-success" : "text-danger"}>
                {up ? <TrendingUp className="h-3.5 w-3.5 inline" /> : <TrendingDown className="h-3.5 w-3.5 inline" />}
                <span className="ml-1 tabular">{formatPercent(diff)}</span>
              </span>
              <span className="text-ink-400">·</span>
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}
