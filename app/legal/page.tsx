import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";

export const metadata = { title: "Legal — SKYLONZE" };

const sections = [
  {
    id: "terms",
    title: "Terms of Service",
    body: [
      "These terms govern your use of SKYLONZE. By creating a profile you agree to forecast in good faith, follow the community guidelines, and use SKY‑3030 only within the SKYLONZE ecosystem.",
      "SKYLONZE may add, modify, suspend or remove markets at any time when source-of-truth resolution data is unavailable, ambiguous, or compromised.",
      "Account security, including credentials and seed-style recovery codes, is the responsibility of the account holder.",
    ],
  },
  {
    id: "privacy",
    title: "Privacy",
    body: [
      "SKYLONZE collects the minimum personal information needed to operate your profile, wallet ledger and leaderboard standing.",
      "We do not sell personal data. Aggregate, non-identifying market-consensus data may be used to improve calibration scoring.",
      "You may request export or deletion of your data at any time from your profile settings.",
    ],
  },
  {
    id: "disclosures",
    title: "Disclosures",
    body: [
      "SKY‑3030 is a virtual ecosystem currency. It is not legal tender, not a security, and has no real-money convertibility.",
      "SKYLONZE is not a brokerage, exchange, or gambling operator. Forecasting on the platform is for entertainment, education, and reputation building.",
      "Market outcomes are resolved against publicly verifiable sources cited in the market's source-of-truth registry.",
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility",
    body: [
      "SKYLONZE is open to users 16 years of age or older. Certain markets may carry additional age restrictions where they reflect adult-themed real-world events.",
      "Access may be limited in jurisdictions where prediction-market platforms — even those operating on virtual currency — are restricted by local regulation.",
      "By using SKYLONZE you confirm that participation is permitted under the laws of your jurisdiction.",
    ],
  },
];

export default function LegalPage() {
  return (
    <>
      <PageHeader
        eyebrow="Legal"
        title={<>Terms, privacy, <span className="text-gradient">disclosures</span> and eligibility.</>}
        description="Read the rules that govern SKYLONZE and SKY‑3030."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          <nav aria-label="Legal sections" className="lg:sticky lg:top-24 h-fit">
            <ul className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible">
              {sections.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`#${s.id}`}
                    className="block rounded-lg border border-violet-400/20 bg-white/[0.03] px-3 py-2 text-xs text-ink-200 hover:text-white hover:border-violet-400/50 whitespace-nowrap"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-6">
            {sections.map((s) => (
              <Card key={s.id}>
                <h2 id={s.id} className="font-display text-xl font-bold uppercase tracking-wide scroll-mt-24">
                  {s.title}
                </h2>
                <div className="mt-3 space-y-3 text-sm text-ink-300">
                  {s.body.map((p, i) => <p key={i}>{p}</p>)}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>
    </>
  );
}
