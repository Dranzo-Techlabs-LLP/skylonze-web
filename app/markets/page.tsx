"use client";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { MarketCard } from "@/components/MarketCard";
import { MarketFilters } from "@/components/MarketFilters";
import { markets, type Category } from "@/lib/data";
import { motion, AnimatePresence } from "framer-motion";

export default function MarketsPage() {
  const [active, setActive] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"volume" | "yes" | "participants">("volume");

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
  }, [active, query, sort]);

  return (
    <>
      <PageHeader
        eyebrow="Markets"
        title={<>Discover, filter, and <span className="text-gradient">forecast</span>.</>}
        description="Real-time prediction markets across crypto, stocks, sports, technology, startups and trending events."
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
          <p className="mb-4 text-xs text-ink-400">{filtered.length} markets</p>
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
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
              <motion.div
                layout
                className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
              >
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
