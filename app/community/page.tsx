import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Button } from "@/components/Button";
import { Badge } from "@/components/Badge";
import { Users, MessageCircle, Trophy, BookOpen, Calendar } from "lucide-react";

export const metadata = { title: "Community — SKYLONZE" };

const posts = [
  {
    title: "Calibration is the new alpha",
    cat: "Insights",
    read: "8 min",
    blurb: "Why being right less often can still beat the market — a primer on Brier scores.",
  },
  {
    title: "How Oracle-rank forecasters research a market",
    cat: "Playbook",
    read: "6 min",
    blurb: "Top-10 forecasters share the workflow they use before every staking decision.",
  },
  {
    title: "Season 01 recap: where consensus broke",
    cat: "Recap",
    read: "5 min",
    blurb: "The five markets where the crowd was loudest — and most wrong.",
  },
  {
    title: "Designing for prediction, not gambling",
    cat: "Design",
    read: "4 min",
    blurb: "How SKYLONZE replaces casino motifs with intelligence-first UX.",
  },
];

export default function CommunityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Community"
        title={<>The <span className="text-gradient">Forecasters Guild</span>.</>}
        description="Tournaments, knowledge swaps and insights from the SKYLONZE community."
      />

      <Section id="guild">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <Users className="h-5 w-5 text-violet-300" />
            <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide">
              Join the Forecasters Guild
            </h2>
            <p className="mt-2 text-sm text-ink-300">
              The Guild is the open community for SKYLONZE forecasters. Coordinate research,
              share calibration sheets, run seasonal tournaments, and connect with Oracle‑rank
              members across crypto, stocks, sports and tech categories.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/signup"><Button size="sm">Create profile</Button></Link>
              <Link href="/leaderboard"><Button size="sm" variant="secondary">View leaderboard</Button></Link>
            </div>
          </Card>
          <Card>
            <Trophy className="h-5 w-5 text-neon-pink" />
            <h3 className="mt-3 font-display text-lg font-bold uppercase tracking-wide">Season 01</h3>
            <p className="mt-2 text-sm text-ink-300">
              Live now — Oct 2025 → Dec 2026. Top 100 forecasters split a SKY‑3030 prize pool
              of 5,000,000.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-400">
              <Calendar className="h-3.5 w-3.5" /> Ends Dec 31, 2026
            </div>
          </Card>
        </div>
      </Section>

      <Section id="insights">
        <div className="flex items-end justify-between mb-6">
          <div className="flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-violet-300" />
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">
              Insights blog
            </h2>
          </div>
          <span className="text-xs text-ink-400">Updated weekly</span>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {posts.map((p) => (
            <Card key={p.title} interactive className="h-full">
              <div className="flex items-center justify-between">
                <Badge tone="violet">{p.cat}</Badge>
                <span className="text-[11px] text-ink-400">{p.read} read</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold leading-tight">{p.title}</h3>
              <p className="mt-2 text-sm text-ink-300">{p.blurb}</p>
              <p className="mt-4 inline-flex items-center gap-1 text-xs text-violet-300">
                <MessageCircle className="h-3.5 w-3.5" /> Discuss in the Guild
              </p>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
