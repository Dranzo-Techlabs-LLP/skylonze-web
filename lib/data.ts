export type Category =
  | "Crypto"
  | "Stocks"
  | "Sports"
  | "Technology"
  | "Startups"
  | "Trending";

export type Market = {
  id: string;
  category: Category;
  title: string;
  question: string;
  closes: string;
  volume: number;
  participants: number;
  yes: number;
  trend: number[];
  hot?: boolean;
  resolution?: string;
};

export const categories: Category[] = [
  "Crypto",
  "Stocks",
  "Sports",
  "Technology",
  "Startups",
  "Trending",
];

export const markets: Market[] = [
  {
    id: "btc-150k",
    category: "Crypto",
    title: "BTC reaches $150K",
    question: "Will Bitcoin close above $150,000 by December 31, 2026?",
    closes: "Dec 31, 2026",
    volume: 4_820_000,
    participants: 18420,
    yes: 62,
    trend: [40, 44, 48, 51, 55, 58, 60, 62],
    hot: true,
  },
  {
    id: "eth-merge2",
    category: "Crypto",
    title: "ETH staking yield > 6%",
    question: "Will Ethereum mainnet staking APR exceed 6% in Q3?",
    closes: "Sep 30, 2026",
    volume: 1_240_000,
    participants: 6210,
    yes: 41,
    trend: [55, 50, 47, 45, 44, 42, 41, 41],
  },
  {
    id: "nvda-5t",
    category: "Stocks",
    title: "NVDA hits $5T market cap",
    question: "Does NVIDIA close any session above $5T market cap this year?",
    closes: "Dec 31, 2026",
    volume: 3_180_000,
    participants: 12044,
    yes: 71,
    trend: [50, 55, 60, 64, 66, 68, 70, 71],
    hot: true,
  },
  {
    id: "spx-7k",
    category: "Stocks",
    title: "S&P 500 above 7,000",
    question: "Will S&P 500 print above 7,000 before year-end?",
    closes: "Dec 31, 2026",
    volume: 2_010_000,
    participants: 9011,
    yes: 38,
    trend: [42, 40, 41, 39, 38, 39, 38, 38],
  },
  {
    id: "wc-final",
    category: "Sports",
    title: "Spain wins UEFA Euro",
    question: "Will Spain win UEFA Euro 2028?",
    closes: "Jul 9, 2028",
    volume: 980_000,
    participants: 7325,
    yes: 28,
    trend: [22, 24, 25, 26, 27, 28, 28, 28],
  },
  {
    id: "f1-25",
    category: "Sports",
    title: "Verstappen 5th title",
    question: "Will Verstappen win F1 2026 Drivers' Championship?",
    closes: "Dec 7, 2026",
    volume: 1_510_000,
    participants: 8702,
    yes: 54,
    trend: [44, 46, 48, 50, 52, 53, 54, 54],
  },
  {
    id: "agi-26",
    category: "Technology",
    title: "OpenAI ships GPT-6",
    question: "Will OpenAI publicly release GPT-6 by Q4 2026?",
    closes: "Dec 31, 2026",
    volume: 2_640_000,
    participants: 14219,
    yes: 47,
    trend: [30, 34, 38, 41, 43, 45, 46, 47],
    hot: true,
  },
  {
    id: "apple-ar",
    category: "Technology",
    title: "Apple ships AR glasses",
    question: "Will Apple announce consumer AR glasses this year?",
    closes: "Nov 1, 2026",
    volume: 870_000,
    participants: 5901,
    yes: 33,
    trend: [40, 38, 36, 35, 34, 33, 33, 33],
  },
  {
    id: "perplexity-ipo",
    category: "Startups",
    title: "Perplexity files S-1",
    question: "Will Perplexity file for IPO by end of 2026?",
    closes: "Dec 31, 2026",
    volume: 760_000,
    participants: 4502,
    yes: 22,
    trend: [16, 18, 19, 21, 22, 22, 22, 22],
  },
  {
    id: "anduril-10b",
    category: "Startups",
    title: "Anduril hits $50B valuation",
    question: "Will Anduril reach $50B private valuation this year?",
    closes: "Dec 31, 2026",
    volume: 610_000,
    participants: 3211,
    yes: 58,
    trend: [40, 44, 48, 52, 54, 56, 58, 58],
  },
  {
    id: "viral-meme",
    category: "Trending",
    title: "AI agent goes viral on X",
    question: "Will an AI agent post exceed 100M impressions in a single day?",
    closes: "Aug 1, 2026",
    volume: 410_000,
    participants: 2890,
    yes: 67,
    trend: [50, 55, 60, 62, 64, 65, 66, 67],
    hot: true,
  },
  {
    id: "mars-launch",
    category: "Trending",
    title: "SpaceX Mars window",
    question: "Will SpaceX launch a Starship to Mars in 2026 window?",
    closes: "Dec 31, 2026",
    volume: 1_240_000,
    participants: 7901,
    yes: 19,
    trend: [25, 23, 22, 21, 20, 19, 19, 19],
  },
];

export type LeaderEntry = {
  rank: number;
  name: string;
  handle: string;
  profit: number;
  accuracy: number;
  streak: number;
  badge: "Oracle" | "Sage" | "Analyst" | "Rookie";
  avatarSeed: string;
};

export const leaderboard: LeaderEntry[] = [
  { rank: 1, name: "Ari Sato", handle: "@ari.sky", profit: 482040, accuracy: 78.2, streak: 21, badge: "Oracle", avatarSeed: "ari" },
  { rank: 2, name: "Lyra Quinn", handle: "@lyraq", profit: 412310, accuracy: 74.0, streak: 17, badge: "Oracle", avatarSeed: "lyra" },
  { rank: 3, name: "Kade Park", handle: "@kade", profit: 388900, accuracy: 71.4, streak: 14, badge: "Sage", avatarSeed: "kade" },
  { rank: 4, name: "Noor Khan", handle: "@noor", profit: 322455, accuracy: 69.9, streak: 12, badge: "Sage", avatarSeed: "noor" },
  { rank: 5, name: "Mateo Cruz", handle: "@matc", profit: 290100, accuracy: 68.1, streak: 9, badge: "Sage", avatarSeed: "mateo" },
  { rank: 6, name: "Indra V", handle: "@indra", profit: 251700, accuracy: 66.0, streak: 7, badge: "Analyst", avatarSeed: "indra" },
  { rank: 7, name: "Yara Bloom", handle: "@yara", profit: 220900, accuracy: 64.8, streak: 5, badge: "Analyst", avatarSeed: "yara" },
  { rank: 8, name: "Zen Ito", handle: "@zen", profit: 198400, accuracy: 63.7, streak: 4, badge: "Analyst", avatarSeed: "zen" },
  { rank: 9, name: "Rae Lin", handle: "@rae", profit: 172800, accuracy: 61.0, streak: 3, badge: "Analyst", avatarSeed: "rae" },
  { rank: 10, name: "Devon Hart", handle: "@dev", profit: 144200, accuracy: 59.2, streak: 3, badge: "Rookie", avatarSeed: "devon" },
];

export type Startup = {
  id: string;
  name: string;
  pitch: string;
  sector: string;
  raised: number;
  valuation: number;
  growth: number;
  founders: string;
  logoSeed: string;
};

export const startups: Startup[] = [
  { id: "lumen-ai", name: "Lumen AI", pitch: "Agentic research copilot for analysts.", sector: "AI / Productivity", raised: 18_000_000, valuation: 220_000_000, growth: 38, founders: "Ari, Kade", logoSeed: "lumen" },
  { id: "orbit-pay", name: "Orbit Pay", pitch: "Programmable settlement rails for emerging markets.", sector: "Fintech", raised: 26_000_000, valuation: 410_000_000, growth: 22, founders: "Lyra, Noor", logoSeed: "orbit" },
  { id: "nova-bio", name: "NovaBio", pitch: "Programmable mRNA design platform.", sector: "BioTech", raised: 41_000_000, valuation: 760_000_000, growth: 17, founders: "Indra, Rae", logoSeed: "nova" },
  { id: "halo-energy", name: "Halo Energy", pitch: "Modular grid-scale sodium-ion batteries.", sector: "ClimateTech", raised: 32_000_000, valuation: 540_000_000, growth: 28, founders: "Mateo, Zen", logoSeed: "halo" },
  { id: "echo-os", name: "Echo OS", pitch: "Spatial computing OS for prosumer headsets.", sector: "Hardware", raised: 12_000_000, valuation: 180_000_000, growth: 44, founders: "Yara, Devon", logoSeed: "echo" },
  { id: "polaris-llm", name: "Polaris", pitch: "Open frontier model trained on verifiable data.", sector: "AI / Infra", raised: 55_000_000, valuation: 980_000_000, growth: 32, founders: "Ari, Indra", logoSeed: "polaris" },
];

export type Reward = {
  day: number;
  amount: number;
  unlocked: boolean;
  special?: string;
};

export const streakRewards: Reward[] = [
  { day: 1, amount: 50, unlocked: true },
  { day: 2, amount: 75, unlocked: true },
  { day: 3, amount: 120, unlocked: true },
  { day: 4, amount: 180, unlocked: true },
  { day: 5, amount: 260, unlocked: false, special: "Boost x1.5" },
  { day: 6, amount: 360, unlocked: false },
  { day: 7, amount: 600, unlocked: false, special: "Oracle Pack" },
];
