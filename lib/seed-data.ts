import type { Category, Market, Startup } from "./data";

// Deterministic 8-point trend ending at `yes`.
export function trendFor(yes: number, seed = 0): number[] {
  const pts: number[] = [];
  const start = Math.max(5, Math.min(95, yes + ((seed % 5) - 2) * 6 - 14));
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    const wobble = Math.sin((seed + i) * 1.7) * 2.2;
    pts.push(Math.round(start + (yes - start) * t + wobble));
  }
  pts[7] = yes;
  return pts.map((p) => Math.max(2, Math.min(98, p)));
}

type Seed = Omit<Market, "trend"> & { hot?: boolean };

export const seedMarkets: Seed[] = [
  // ── Crypto ──
  { id: "btc-150k", category: "Crypto", title: "BTC reaches $150K", question: "Will Bitcoin close above $150,000 by December 31, 2026?", closes: "Dec 31, 2026", volume: 4_820_000, participants: 18420, yes: 62, hot: true },
  { id: "eth-6pct", category: "Crypto", title: "ETH staking yield > 6%", question: "Will Ethereum mainnet staking APR exceed 6% in Q3 2026?", closes: "Sep 30, 2026", volume: 1_240_000, participants: 6210, yes: 41 },
  { id: "sol-300", category: "Crypto", title: "Solana above $300", question: "Will SOL trade above $300 at any point in 2026?", closes: "Dec 31, 2026", volume: 980_000, participants: 5120, yes: 48 },
  { id: "btc-etf-100b", category: "Crypto", title: "BTC ETF AUM > $200B", question: "Will spot Bitcoin ETFs hold over $200B in assets by year-end?", closes: "Dec 31, 2026", volume: 1_510_000, participants: 7340, yes: 55, hot: true },
  { id: "stable-1t", category: "Crypto", title: "Stablecoin supply > $1T", question: "Will total stablecoin market cap exceed $1 trillion in 2026?", closes: "Dec 31, 2026", volume: 720_000, participants: 3980, yes: 34 },
  { id: "xrp-case", category: "Crypto", title: "New crypto framework", question: "Will the US pass a comprehensive crypto market-structure bill in 2026?", closes: "Dec 31, 2026", volume: 640_000, participants: 4410, yes: 44 },

  // ── Stocks ──
  { id: "nvda-5t", category: "Stocks", title: "NVDA hits $5T market cap", question: "Does NVIDIA close any session above $5T market cap in 2026?", closes: "Dec 31, 2026", volume: 3_180_000, participants: 12044, yes: 71, hot: true },
  { id: "spx-7k", category: "Stocks", title: "S&P 500 above 7,000", question: "Will the S&P 500 print above 7,000 before year-end?", closes: "Dec 31, 2026", volume: 2_010_000, participants: 9011, yes: 38 },
  { id: "tsla-500", category: "Stocks", title: "Tesla above $500", question: "Will Tesla close above $500 at any point in 2026?", closes: "Dec 31, 2026", volume: 1_390_000, participants: 8120, yes: 45 },
  { id: "aapl-4t", category: "Stocks", title: "Apple holds $4T cap", question: "Will Apple sustain a $4T+ market cap through Q4 2026?", closes: "Dec 31, 2026", volume: 1_120_000, participants: 6701, yes: 58 },
  { id: "fed-cut", category: "Stocks", title: "Fed cuts below 3.5%", question: "Will the Fed funds upper bound fall below 3.5% in 2026?", closes: "Dec 31, 2026", volume: 1_640_000, participants: 7720, yes: 52, hot: true },
  { id: "ipo-2026", category: "Stocks", title: "Mega IPO > $20B", question: "Will any 2026 IPO price at a $20B+ valuation?", closes: "Dec 31, 2026", volume: 540_000, participants: 3110, yes: 36 },

  // ── Sports ──
  { id: "euro-spain", category: "Sports", title: "Spain win next major", question: "Will Spain win their next senior international tournament?", closes: "Jul 9, 2028", volume: 980_000, participants: 7325, yes: 28 },
  { id: "f1-verstappen", category: "Sports", title: "Verstappen title", question: "Will Verstappen win the 2026 F1 Drivers' Championship?", closes: "Dec 7, 2026", volume: 1_510_000, participants: 8702, yes: 54 },
  { id: "nba-finals", category: "Sports", title: "Celtics repeat", question: "Will the Boston Celtics win the 2026 NBA Finals?", closes: "Jun 20, 2026", volume: 870_000, participants: 5410, yes: 31 },
  { id: "wc-2026", category: "Sports", title: "Host nation final", question: "Will a 2026 World Cup host nation reach the final?", closes: "Jul 19, 2026", volume: 1_260_000, participants: 9120, yes: 22, hot: true },
  { id: "wimbledon-26", category: "Sports", title: "Alcaraz Wimbledon", question: "Will Carlos Alcaraz win Wimbledon 2026?", closes: "Jul 12, 2026", volume: 610_000, participants: 4010, yes: 47 },
  { id: "cricket-t20", category: "Sports", title: "India win T20 WC", question: "Will India win the 2026 T20 World Cup?", closes: "Mar 8, 2026", volume: 1_040_000, participants: 11210, yes: 39 },

  // ── Technology ──
  { id: "gpt6", category: "Technology", title: "OpenAI ships GPT-6", question: "Will OpenAI publicly release GPT-6 by Q4 2026?", closes: "Dec 31, 2026", volume: 2_640_000, participants: 14219, yes: 47, hot: true },
  { id: "apple-ar", category: "Technology", title: "Apple AR glasses", question: "Will Apple announce consumer AR glasses in 2026?", closes: "Nov 1, 2026", volume: 870_000, participants: 5901, yes: 33 },
  { id: "agi-claim", category: "Technology", title: "Major AGI claim", question: "Will a frontier lab publicly claim AGI in 2026?", closes: "Dec 31, 2026", volume: 1_180_000, participants: 8810, yes: 26 },
  { id: "quantum-adv", category: "Technology", title: "Quantum advantage", question: "Will a verifiable practical quantum advantage be demonstrated in 2026?", closes: "Dec 31, 2026", volume: 520_000, participants: 3320, yes: 29 },
  { id: "tiktok-us", category: "Technology", title: "TikTok US resolution", question: "Will TikTok's US ownership be resolved (sale or ban) in 2026?", closes: "Dec 31, 2026", volume: 940_000, participants: 7110, yes: 61 },
  { id: "starlink-ipo", category: "Technology", title: "Starlink IPO", question: "Will Starlink file to go public in 2026?", closes: "Dec 31, 2026", volume: 680_000, participants: 4520, yes: 35 },

  // ── Startups ──
  { id: "perplexity-ipo", category: "Startups", title: "Perplexity files S-1", question: "Will Perplexity file for IPO by the end of 2026?", closes: "Dec 31, 2026", volume: 760_000, participants: 4502, yes: 22 },
  { id: "anduril-50b", category: "Startups", title: "Anduril $50B valuation", question: "Will Anduril reach a $50B private valuation in 2026?", closes: "Dec 31, 2026", volume: 610_000, participants: 3211, yes: 58 },
  { id: "openai-1t", category: "Startups", title: "OpenAI $1T valuation", question: "Will OpenAI's valuation reach $1T in 2026?", closes: "Dec 31, 2026", volume: 1_320_000, participants: 9810, yes: 43, hot: true },
  { id: "spacex-400b", category: "Startups", title: "SpaceX $500B", question: "Will SpaceX reach a $500B valuation in 2026?", closes: "Dec 31, 2026", volume: 880_000, participants: 6120, yes: 49 },
  { id: "stripe-ipo", category: "Startups", title: "Stripe IPO", question: "Will Stripe go public in 2026?", closes: "Dec 31, 2026", volume: 700_000, participants: 5210, yes: 27 },
  { id: "anthropic-100b", category: "Startups", title: "Anthropic > $150B", question: "Will Anthropic's valuation exceed $150B in 2026?", closes: "Dec 31, 2026", volume: 760_000, participants: 6440, yes: 51 },

  // ── Trending ──
  { id: "ai-viral", category: "Trending", title: "AI agent goes viral", question: "Will an AI agent post exceed 100M impressions in a single day?", closes: "Aug 1, 2026", volume: 410_000, participants: 2890, yes: 67, hot: true },
  { id: "mars-window", category: "Trending", title: "Starship to Mars", question: "Will SpaceX launch a Starship toward Mars in the 2026 window?", closes: "Dec 31, 2026", volume: 1_240_000, participants: 7901, yes: 19 },
  { id: "box-office", category: "Trending", title: "$2B box office film", question: "Will any 2026 film gross over $2B worldwide?", closes: "Dec 31, 2026", volume: 520_000, participants: 4120, yes: 24 },
  { id: "tour-record", category: "Trending", title: "Record concert tour", question: "Will a 2026 concert tour gross over $1.5B?", closes: "Dec 31, 2026", volume: 360_000, participants: 2610, yes: 41 },
  { id: "meme-coin", category: "Trending", title: "Meme coin top 10", question: "Will a meme coin enter the top 10 by market cap in 2026?", closes: "Dec 31, 2026", volume: 480_000, participants: 5310, yes: 33 },
  { id: "netflix-sub", category: "Trending", title: "Netflix > 350M subs", question: "Will Netflix exceed 350M paid subscribers in 2026?", closes: "Dec 31, 2026", volume: 540_000, participants: 4710, yes: 56 },

  // ── Politics ──
  { id: "us-midterm", category: "Politics", title: "House control flips", question: "Will the US House majority flip party in the 2026 midterms?", closes: "Nov 3, 2026", volume: 2_180_000, participants: 16420, yes: 52, hot: true },
  { id: "uk-election", category: "Politics", title: "UK snap election", question: "Will the UK hold a general election in 2026?", closes: "Dec 31, 2026", volume: 740_000, participants: 5210, yes: 31 },
  { id: "eu-ai-act", category: "Politics", title: "EU AI Act phase-in", question: "Will the EU enforce full AI Act high-risk rules in 2026?", closes: "Dec 31, 2026", volume: 520_000, participants: 3810, yes: 58 },
  { id: "fed-chair", category: "Politics", title: "New Fed chair named", question: "Will a new Federal Reserve chair be nominated in 2026?", closes: "Dec 31, 2026", volume: 880_000, participants: 6120, yes: 46 },
  { id: "gov-shutdown", category: "Politics", title: "US gov shutdown", question: "Will there be a US federal government shutdown in 2026?", closes: "Dec 31, 2026", volume: 960_000, participants: 7210, yes: 38 },
  { id: "climate-deal", category: "Politics", title: "Global climate deal", question: "Will COP31 produce a binding new emissions agreement?", closes: "Nov 30, 2026", volume: 430_000, participants: 3120, yes: 27 },
];

export function withTrends(): Market[] {
  return seedMarkets.map((m, i) => ({ ...m, trend: trendFor(m.yes, i) }));
}

export const seedStartups: Startup[] = [
  { id: "lumen-ai", name: "Lumen AI", pitch: "Agentic research copilot for analysts.", sector: "AI / Productivity", raised: 18_000_000, valuation: 220_000_000, growth: 38, founders: "Ari, Kade", logoSeed: "lumen" },
  { id: "orbit-pay", name: "Orbit Pay", pitch: "Programmable settlement rails for emerging markets.", sector: "Fintech", raised: 26_000_000, valuation: 410_000_000, growth: 22, founders: "Lyra, Noor", logoSeed: "orbit" },
  { id: "nova-bio", name: "NovaBio", pitch: "Programmable mRNA design platform.", sector: "BioTech", raised: 41_000_000, valuation: 760_000_000, growth: 17, founders: "Indra, Rae", logoSeed: "nova" },
  { id: "halo-energy", name: "Halo Energy", pitch: "Modular grid-scale sodium-ion batteries.", sector: "ClimateTech", raised: 32_000_000, valuation: 540_000_000, growth: 28, founders: "Mateo, Zen", logoSeed: "halo" },
  { id: "echo-os", name: "Echo OS", pitch: "Spatial computing OS for prosumer headsets.", sector: "Hardware", raised: 12_000_000, valuation: 180_000_000, growth: 44, founders: "Yara, Devon", logoSeed: "echo" },
  { id: "polaris-llm", name: "Polaris", pitch: "Open frontier model trained on verifiable data.", sector: "AI / Infra", raised: 55_000_000, valuation: 980_000_000, growth: 32, founders: "Ari, Indra", logoSeed: "polaris" },
  { id: "verdant-ag", name: "Verdant", pitch: "Autonomous precision farming robotics.", sector: "AgriTech", raised: 21_000_000, valuation: 300_000_000, growth: 26, founders: "Noor, Mateo", logoSeed: "verdant" },
  { id: "ledgerly", name: "Ledgerly", pitch: "Real-time compliance for cross-border payments.", sector: "Fintech", raised: 16_000_000, valuation: 240_000_000, growth: 35, founders: "Lyra, Zen", logoSeed: "ledgerly" },
];
