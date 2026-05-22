"use client";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StartupCard } from "@/components/StartupCard";
import type { Startup } from "@/lib/data";
import { apiGet } from "@/lib/client";
import { cn } from "@/lib/utils";

export default function StartupsPage() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [sector, setSector] = useState<string>("All");
  const [q, setQ] = useState("");

  useEffect(() => {
    apiGet<{ startups: Startup[] }>("/api/startups").then(({ startups }) => setStartups(startups)).catch(() => {});
  }, []);

  const sectors = useMemo(
    () => ["All", ...Array.from(new Set(startups.map((s) => s.sector)))],
    [startups],
  );

  const list = useMemo(() => {
    let l = startups.filter((s) => (sector === "All" ? true : s.sector === sector));
    if (q.trim()) {
      const t = q.toLowerCase();
      l = l.filter((s) => s.name.toLowerCase().includes(t) || s.pitch.toLowerCase().includes(t));
    }
    return l;
  }, [startups, sector, q]);

  return (
    <>
      <PageHeader
        eyebrow="Startup showcase"
        title={<>Back the future, one <span className="text-gradient">conviction</span> at a time.</>}
        description="Allocate virtual SKY to high-conviction private companies. Performance is scored against community consensus and milestones."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search startups…"
              aria-label="Search startups"
              className="h-11 w-full rounded-xl border border-violet-400/25 bg-white/5 pl-10 pr-3 text-sm placeholder:text-ink-400 outline-none focus:border-violet-400/70"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {sectors.map((s) => {
              const a = sector === s;
              return (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={cn(
                    "relative h-9 rounded-full px-4 text-xs font-medium transition whitespace-nowrap",
                    a ? "text-white" : "text-ink-300 border border-violet-400/20 hover:text-white",
                  )}
                  aria-pressed={a}
                >
                  {a && (
                    <motion.span
                      layoutId="sector-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-neon-cyan/80 shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative">{s}</span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {list.map((s, i) => (
            <StartupCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </section>
    </>
  );
}
