import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { MapPin, Briefcase } from "lucide-react";

export const metadata = { title: "Careers — SKYLONZE" };

const roles = [
  {
    title: "Senior Frontend Engineer",
    team: "Engineering",
    location: "Remote · Global",
    type: "Full-time",
    desc: "React, TypeScript, motion. Ship the next-gen prediction UI for millions of forecasters.",
  },
  {
    title: "Market Operations Analyst",
    team: "Markets",
    location: "Remote · EMEA",
    type: "Full-time",
    desc: "Design, monitor and resolve prediction markets across crypto, stocks, sports and tech.",
  },
  {
    title: "Community Manager",
    team: "Community",
    location: "Remote · APAC",
    type: "Full-time",
    desc: "Run the Forecasters Guild. Host seasonal tournaments and grow ambassador programs.",
  },
  {
    title: "Data Scientist · Calibration",
    team: "Data",
    location: "Remote · Americas",
    type: "Full-time",
    desc: "Build calibration metrics, leaderboard scoring and accuracy models.",
  },
  {
    title: "Product Designer · Mobile",
    team: "Design",
    location: "Remote · Global",
    type: "Full-time",
    desc: "Mobile-first interaction design for the next-gen prediction experience.",
  },
];

export default function CareersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Careers"
        title={<>Build the <span className="text-gradient">prediction economy</span> with us.</>}
        description="SKYLONZE is hiring across engineering, markets, design, and community. Fully remote, global."
      />
      <Section>
        <div className="grid gap-4 md:grid-cols-2">
          {roles.map((r) => (
            <Card key={r.title} className="h-full">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Badge tone="violet">{r.team}</Badge>
                  <h3 className="mt-2 font-display text-lg font-bold uppercase tracking-wide">{r.title}</h3>
                </div>
                <Badge tone="cyan">{r.type}</Badge>
              </div>
              <p className="mt-3 text-sm text-ink-300">{r.desc}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-ink-400">
                <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{r.location}</span>
                <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" />{r.team}</span>
              </div>
              <a
                href="mailto:careers@skylonze.com"
                className="mt-5 inline-flex h-10 items-center justify-center rounded-xl border border-violet-400/30 bg-white/5 px-4 text-xs font-medium hover:border-violet-400/60"
              >
                Apply — careers@skylonze.com
              </a>
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}
