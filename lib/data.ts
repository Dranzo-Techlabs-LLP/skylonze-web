export type Category =
  | "Crypto"
  | "Stocks"
  | "Sports"
  | "Technology"
  | "Startups"
  | "Trending"
  | "Politics";

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
  "Politics",
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
  logoUrl?: string | null;
};

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
