import { query } from "./db";

export type LeaderRow = {
  id: number;
  name: string;
  handle: string;
  avatar_seed: string | null;
  sky_balance: number;
  wins: number;
  losses: number;
  profit: number;        // realized: sum(payout-stake) on won, -stake on lost
  accuracy: number;      // wins / settled * 100
  badge: "Oracle" | "Sage" | "Analyst" | "Rookie";
  rank: number;
};

function badge(profit: number, accuracy: number, settled: number): LeaderRow["badge"] {
  if (settled >= 10 && profit >= 100_000 && accuracy >= 70) return "Oracle";
  if (profit >= 25_000) return "Sage";
  if (settled > 0) return "Analyst";
  return "Rookie";
}

export async function getLeaderboard(limit = 50): Promise<LeaderRow[]> {
  const rows = await query<any>(
    `SELECT u.id, u.name, u.handle, u.avatar_seed, u.sky_balance,
       COALESCE(SUM(CASE WHEN p.status='won' THEN 1 ELSE 0 END),0) wins,
       COALESCE(SUM(CASE WHEN p.status='lost' THEN 1 ELSE 0 END),0) losses,
       COALESCE(SUM(CASE
         WHEN p.status='won' THEN p.potential_payout - p.stake
         WHEN p.status='lost' THEN -p.stake
         ELSE 0 END),0) profit
     FROM users u
     LEFT JOIN predictions p ON p.user_id = u.id
     WHERE u.role = 'user' AND u.status = 'active'
     GROUP BY u.id
     ORDER BY profit DESC, u.sky_balance DESC, u.id ASC
     LIMIT ?`,
    [limit],
  );

  return rows.map((r, i) => {
    const wins = Number(r.wins), losses = Number(r.losses);
    const settled = wins + losses;
    const accuracy = settled > 0 ? (wins / settled) * 100 : 0;
    const profit = Number(r.profit);
    return {
      id: r.id,
      name: r.name,
      handle: r.handle,
      avatar_seed: r.avatar_seed,
      sky_balance: Number(r.sky_balance),
      wins, losses, profit,
      accuracy,
      badge: badge(profit, accuracy, settled),
      rank: i + 1,
    };
  });
}
