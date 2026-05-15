import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Button } from "@/components/Button";
import { Card } from "@/components/Card";
import { Sparkles, Compass, Newspaper, Telescope } from "lucide-react";

export const metadata = { title: "About — SKYLONZE" };

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="About"
        title={<>One platform. <span className="text-gradient">Endless possibilities.</span></>}
        description="SKYLONZE is a next-generation digital ecosystem uniting prediction markets, startup investing, digital assets and community intelligence."
      />

      <Section id="mission">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card>
            <Sparkles className="h-5 w-5 text-neon-pink" />
            <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide">Mission</h2>
            <p className="mt-2 text-sm text-ink-300">
              Make prediction intelligence accessible, engaging, and competitive for the next
              generation. We replace casino aesthetics with innovation-first design and a
              community that rewards reasoning, not gambling.
            </p>
          </Card>
          <Card>
            <Compass className="h-5 w-5 text-violet-300" />
            <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide">Vision</h2>
            <p className="mt-2 text-sm text-ink-300">
              A digital economy built on skills, insights and reputation — where forecasters,
              startup backers and builders share a single transparent ledger of conviction.
            </p>
          </Card>
          <Card>
            <Telescope className="h-5 w-5 text-neon-cyan" />
            <h2 className="mt-3 font-display text-xl font-bold uppercase tracking-wide">Approach</h2>
            <p className="mt-2 text-sm text-ink-300">
              SKY‑3030 is the native virtual currency. It powers staking, payouts and rewards
              while keeping the platform a pure prediction ecosystem, free of real-money risk.
            </p>
          </Card>
        </div>
      </Section>

      <Section id="press">
        <div className="flex items-center gap-3 mb-6">
          <Newspaper className="h-5 w-5 text-violet-300" />
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-wide">Press</h2>
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-ink-300">
            For press enquiries, partnerships, or interview requests reach the team at{" "}
            <span className="text-violet-300">press@skylonze.com</span>.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link href="/careers"><Button variant="secondary" size="sm">Open roles</Button></Link>
            <Link href="/community"><Button variant="secondary" size="sm">Join community</Button></Link>
          </div>
        </div>
      </Section>
    </>
  );
}
