"use client";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MarketCard } from "@/components/MarketCard";
import { MarketFilters } from "@/components/MarketFilters";
import { type Category, type Market } from "@/lib/data";
import { apiGet } from "@/lib/client";
import { motion, AnimatePresence } from "framer-motion";

export default function PredictPage() {
  const [markets, setMarkets] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"volume" | "yes" | "participants">("volume");

  useEffect(() => {
    apiGet<{ markets: Market[] }>("/api/markets")
      .then(({ markets }) => setMarkets(markets))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = markets.filter((m) => (active === "All" ? true : m.category === active));
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) => m.title.toLowerCase().includes(q) || m.question.toLowerCase().includes(q),
      );
    }
    list = [...list].sort((a, b) => b[sort] - a[sort]);
    return list;
  }, [markets, active, query, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Predict"
        title={<>Discover, filter, and <span className="text-gradient">forecast</span>.</>}
        description="Real-time prediction markets across crypto, stocks, sports, technology, startups, trending and politics."
      />
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <MarketFilters
          active={active}
          onChange={setActive}
          query={query}
          onQueryChange={setQuery}
          sort={sort}
          onSortChange={setSort}
        />

        <div className="mt-8">
          <p className="mb-4 text-xs text-ink-400">{loading ? "Loading…" : `${filtered.length} markets`}</p>
          <AnimatePresence mode="popLayout">
            {!loading && filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="glass rounded-2xl p-10 text-center text-ink-300"
              >
                No markets match. Try a different filter.
              </motion.div>
            ) : (
              <motion.div layout className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map((m, i) => (
                  <MarketCard key={m.id} m={m} index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
