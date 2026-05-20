import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Users, Calendar, Flame } from "lucide-react";
import { markets } from "@/lib/data";
import { Badge } from "@/components/Badge";
import { ProbabilityBar } from "@/components/ProbabilityBar";
import { ChartArea } from "@/components/ChartArea";
import { PredictionPanel } from "@/components/PredictionPanel";
import { SkyCoin } from "@/components/SkyCoin";
import { Avatar } from "@/components/Avatar";
import { formatSky } from "@/lib/utils";
import { leaderboard } from "@/lib/data";
import { getResolution } from "@/lib/predictions";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return markets.map((m) => ({ id: m.id }));
}

export default async function MarketDetail({ params }: { params: { id: string } }) {
  const m = markets.find((x) => x.id === params.id);
  if (!m) return notFound();

  const resolution = await getResolution(m.id);
  const recent = leaderboard.slice(0, 6);

  return (
    <>
      <div className="relative pt-10 md:pt-14">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" />
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <Link
            href="/markets"
            className="inline-flex items-center gap-1 text-xs text-ink-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" /> All markets
          </Link>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Badge tone="violet">{m.category}</Badge>
            {resolution && (
              <Badge tone={resolution.outcome === "YES" ? "success" : "danger"}>
                Resolved · {resolution.outcome}
              </Badge>
            )}
            {m.hot && !resolution && (
              <Badge tone="pink" className="gap-1">
                <Flame className="h-3 w-3" /> Trending
              </Badge>
            )}
          </div>
          <h1 className="mt-2 font-display text-3xl md:text-5xl font-bold leading-tight">
            {m.title}
          </h1>
          <p className="mt-3 max-w-3xl text-ink-200/90">{m.question}</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-ink-400">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> {m.participants.toLocaleString()} forecasters
            </span>
            <span className="inline-flex items-center gap-1.5 tabular">
              <SkyCoin size={14} spin={false} /> {formatSky(m.volume)} SKY volume
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" /> Closes {m.closes}
            </span>
          </div>
        </div>
      </div>

      <section className="mx-auto mt-10 grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-ink-400">Current consensus</p>
                <p className="mt-1 font-display text-4xl font-bold tabular text-gradient">
                  {m.yes}% YES
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-wider text-ink-400">Last 24h</p>
                <p className="font-display text-sm font-bold tabular text-success">
                  +{((m.trend[m.trend.length - 1] - m.trend[m.trend.length - 2]) || 1).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="mt-4">
              <ProbabilityBar yes={m.yes} />
            </div>
            <div className="mt-6">
              <ChartArea data={m.trend} />
            </div>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-semibold">Top forecasters on this market</h2>
              <Link href="/leaderboard" className="text-xs text-violet-300 hover:text-white">
                See all
              </Link>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {recent.map((u) => (
                <li
                  key={u.handle}
                  className="flex items-center gap-3 rounded-2xl border border-violet-400/15 bg-white/[0.03] p-3"
                >
                  <Avatar seed={u.avatarSeed} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{u.name}</p>
                    <p className="truncate text-[11px] text-ink-400">{u.handle}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-ink-400 uppercase tracking-wider">Acc</p>
                    <p className="font-display text-sm font-bold tabular text-gradient">
                      {u.accuracy.toFixed(1)}%
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass rounded-3xl p-5 sm:p-6">
            <h2 className="font-display text-lg font-semibold">Resolution criteria</h2>
            <p className="mt-2 text-sm text-ink-200/90">
              {m.resolution ??
                `This market resolves "YES" if the stated condition is verifiably true on or before ${m.closes}, based on primary sources cited in the market's source-of-truth registry. Otherwise it resolves "NO". All SKY-3030 payouts are calculated against the closing consensus.`}
            </p>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 h-fit">
          <PredictionPanel yes={m.yes} marketId={m.id} resolvedOutcome={resolution?.outcome ?? null} />
        </div>
      </section>
    </>
  );
}
