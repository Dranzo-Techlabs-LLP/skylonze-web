# SKYLONZE

Futuristic prediction market platform powered by SKY-3030.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (custom dark/violet design tokens)
- Framer Motion (animations, page transitions, layout)
- React Three Fiber + drei + three.js (3D hero orb, rings, particles)
- lucide-react (iconography — SVG, no emojis)

## Pages

- `/` Landing (hero, ticker, features, trending markets, streak, leaderboard, startups, how it works, CTA)
- `/markets` Filterable, searchable market grid
- `/markets/[id]` Market detail with chart + prediction panel
- `/leaderboard` Podium + table with range filters
- `/wallet` Balance, stats, portfolio, transactions, 3D orb
- `/startups` Showcase grid with sector filter
- `/dashboard` Logged-in hub (positions, streak, ranking, recs)
- `/profile` Identity, accuracy, profit, badges, history
- `/login`, `/signup` Auth shells with split layout + 3D side
- `/not-found` Themed 404

## Run

```bash
npm install
npm run dev
```

## Notes

- Dark, futuristic purple/black, glassmorphism, glow.
- Mobile-first, accessible (skip link, focus rings, aria, reduced motion).
- No casino aesthetics — innovation + intelligence framing.
- SKY-3030 marked as a virtual ecosystem currency.
