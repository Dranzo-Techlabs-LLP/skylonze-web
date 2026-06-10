"use client";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories as defaultCategories, type Category } from "@/lib/data";

export function MarketFilters({
  active,
  onChange,
  query,
  onQueryChange,
  sort,
  onSortChange,
  categories,
}: {
  active: Category | "All";
  onChange: (c: Category | "All") => void;
  query: string;
  onQueryChange: (s: string) => void;
  sort: "volume" | "yes" | "participants";
  onSortChange: (s: "volume" | "yes" | "participants") => void;
  categories?: Category[];
}) {
  const tabs: (Category | "All")[] = ["All", ...(categories?.length ? categories : defaultCategories)];
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Search markets…"
            aria-label="Search markets"
            className="h-11 w-full rounded-xl border border-violet-400/25 bg-white/5 pl-10 pr-3 text-sm placeholder:text-ink-400 outline-none focus:border-violet-400/70"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-ink-400 uppercase tracking-wider">Sort</span>
          {(["volume", "yes", "participants"] as const).map((s) => (
            <button
              key={s}
              onClick={() => onSortChange(s)}
              className={cn(
                "h-9 rounded-lg px-3 text-xs font-medium capitalize transition",
                sort === s
                  ? "bg-violet-500/20 text-white border border-violet-400/50"
                  : "border border-violet-400/15 bg-white/[0.03] text-ink-300 hover:text-white"
              )}
              aria-pressed={sort === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div className="relative -mx-4 px-4 overflow-x-auto sm:mx-0 sm:px-0">
        <div className="flex w-max gap-2 sm:w-full sm:flex-wrap">
          {tabs.map((t) => {
            const isActive = active === t;
            return (
              <button
                key={t}
                onClick={() => onChange(t)}
                className={cn(
                  "relative h-9 rounded-full px-4 text-xs font-medium transition whitespace-nowrap",
                  isActive
                    ? "text-white"
                    : "text-ink-300 border border-violet-400/20 hover:text-white"
                )}
                aria-pressed={isActive}
              >
                {isActive && (
                  <motion.span
                    layoutId="pill"
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600 to-neon-pink shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative">{t}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
