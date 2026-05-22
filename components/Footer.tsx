import Link from "next/link";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Platform",
    links: [
      { href: "/markets", label: "Predict" },
      { href: "/leaderboard", label: "Leaderboard" },
      { href: "/startups", label: "Startups" },
      { href: "/wallet", label: "Wallet" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/profile", label: "Profile" },
      { href: "/community#guild", label: "Forecasters Guild" },
      { href: "/community#insights", label: "Insights blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/about#mission", label: "Mission" },
      { href: "/about#press", label: "Press" },
      { href: "/careers", label: "Careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/legal#terms", label: "Terms" },
      { href: "/legal#privacy", label: "Privacy" },
      { href: "/legal#disclosures", label: "Disclosures" },
      { href: "/legal#eligibility", label: "Eligibility" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-violet-400/15 bg-bg-900/60">
      <div className="absolute inset-x-0 top-0 -translate-y-1/2 flex justify-center">
        <div className="h-px w-1/2 bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-4 py-14 sm:px-6 md:grid-cols-6">
        <div className="col-span-2 space-y-4">
          <Logo />
          <p className="text-sm text-ink-400 max-w-xs">
            A next-gen prediction ecosystem. Forecast markets, climb ranks, and grow your SKY-3030.
          </p>
          <a
            href="mailto:info@skylonze.com"
            className="inline-flex items-center gap-2 rounded-lg border border-violet-400/30 bg-white/5 px-3 py-2 text-xs hover:border-violet-400/60 transition"
          >
            info@skylonze.com
          </a>
        </div>
        {cols.map((c) => (
          <div key={c.title} className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">{c.title}</h4>
            <ul className="space-y-2">
              {c.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm text-ink-200 hover:text-white transition">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-violet-400/10 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-xs text-ink-400 sm:flex-row sm:px-6">
          <p>© 2026 SKYLONZE Labs. SKY-3030 is a virtual ecosystem currency, not legal tender.</p>
          <p className="font-mono">v0.1 · prediction intelligence</p>
        </div>
      </div>
    </footer>
  );
}
