import Link from "next/link";
import { Hero } from "@/components/Hero";
import { StatsBand } from "@/components/StatsBand";
import { TickerMarquee } from "@/components/TickerMarquee";
import { WhatIsSkylonze } from "@/components/WhatIsSkylonze";
import { SkyCoinShowcase } from "@/components/SkyCoinShowcase";
import { BuiltForSection } from "@/components/BuiltForSection";
import { PillarsRow } from "@/components/PillarsRow";
import { Section, SectionHeader } from "@/components/Section";
import { MarketCard } from "@/components/MarketCard";
import { LeaderboardPreview } from "@/components/LeaderboardPreview";
import { StreakStrip } from "@/components/StreakStrip";
import { StartupCard } from "@/components/StartupCard";
import { Button } from "@/components/Button";
import { SkyCoin } from "@/components/SkyCoin";
import { listMarkets } from "@/lib/markets";
import { listStartups } from "@/lib/startups";
import { ChevronRight, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [allMarkets, startups] = await Promise.all([listMarkets(), listStartups()]);
  const hot = allMarkets.filter((m) => m.hot);
  const seen = new Set<string>();
  const trending = [...hot, ...allMarkets].filter((m) => (seen.has(m.id) ? false : seen.add(m.id))).slice(0, 6);

  return (
    <>
      <Hero />
      <StatsBand />
      <TickerMarquee />

      <WhatIsSkylonze />

      <Section id="trending">
        <div className="mb-10 flex items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Live · real-time"
            title={<>Trending markets <span className="text-gradient">right now</span></>}
            description="Hot questions, fast-moving consensus, dense participation."
          />
          <Link href="/markets" className="hidden md:inline-flex items-center gap-1 text-sm text-violet-300 hover:text-white">
            All markets <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trending.map((m, i) => (
            <MarketCard key={m.id} m={m} index={i} />
          ))}
        </div>
      </Section>

      <SkyCoinShowcase />

      <BuiltForSection />

      <Section id="rewards">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          <div>
            <SectionHeader
              eyebrow="Streaks & progression"
              title={<>Show up. Predict. <span className="text-gradient">Level up.</span></>}
              description="Daily forecasting builds streaks. Streaks unlock SKY bonuses, multipliers, and seasonal badges that surface on your profile and the leaderboard."
            />
            <StreakStrip />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/signup">
                <Button size="lg">Start your streak <ChevronRight className="h-4 w-4" /></Button>
              </Link>
              <Link href="/profile">
                <Button variant="secondary" size="lg">View progression</Button>
              </Link>
            </div>
          </div>
          <LeaderboardPreview />
        </div>
      </Section>

      <Section id="startups">
        <SectionHeader
          eyebrow="Startup showcase"
          title={<>Back the next <span className="text-gradient">decade-defining</span> companies.</>}
          description="Discover curated, community-rated private companies. Allocate virtual SKY to express conviction and earn rewards as theses play out."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {startups.slice(0, 6).map((s, i) => (
            <StartupCard key={s.id} s={s} index={i} />
          ))}
        </div>
        <div className="mt-8">
          <Link href="/startups">
            <Button variant="secondary">See full showcase <ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </Section>

      <PillarsRow />

      {/* CTA */}
      <Section id="cta">
        <div className="gradient-border relative overflow-hidden p-1">
          <div className="relative rounded-2xl bg-bg-800/80 p-10 md:p-16 text-center">
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-50" />
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[600px] -translate-x-1/2 rounded-full bg-violet-500/30 blur-3xl" />
            <div className="relative mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-white/5 px-3 py-1.5 text-xs">
                <Sparkles className="h-3.5 w-3.5 text-neon-pink" /> Season 01 ends Dec 31, 2026
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold leading-[0.95] uppercase tracking-tight">
                <span className="text-white">The Future</span>{" "}
                <span className="text-gradient">Starts Now.</span>
              </h2>
              <p className="text-ink-200">
                Join 86,000+ forecasters shaping the consensus of tomorrow. Earn SKY‑3030, climb the leaderboard, and unlock the Oracle rank.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link href="/signup">
                  <Button size="lg"><SkyCoin size={20} /> Claim starter SKY</Button>
                </Link>
                <Link href="/markets">
                  <Button variant="secondary" size="lg">Browse markets</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
