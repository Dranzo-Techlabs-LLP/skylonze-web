import { query } from "./db";

export type PlatformStats = {
  volume: number;        // total SKY wagered (sum of stakes)
  activeMarkets: number; // markets without a resolution
  totalMarkets: number;
  users: number;         // role = user
  predictors: number;    // distinct users with >=1 prediction
  startups: number;
  resolved: number;      // resolved markets
  winRate: number;       // settled win %
};

export async function getStats(): Promise<PlatformStats> {
  const [vol] = await query<{ v: number }>("SELECT COALESCE(SUM(stake),0) v FROM predictions");
  const [mk] = await query<{ n: number }>("SELECT COUNT(*) n FROM markets");
  const [res] = await query<{ n: number }>("SELECT COUNT(*) n FROM market_resolutions");
  const [usr] = await query<{ n: number }>("SELECT COUNT(*) n FROM users WHERE role='user'");
  const [pred] = await query<{ n: number }>("SELECT COUNT(DISTINCT user_id) n FROM predictions");
  const [st] = await query<{ n: number }>("SELECT COUNT(*) n FROM startups");
  const [wl] = await query<{ won: number; lost: number }>(
    "SELECT COALESCE(SUM(status='won'),0) won, COALESCE(SUM(status='lost'),0) lost FROM predictions",
  );

  const totalMarkets = Number(mk.n);
  const resolved = Number(res.n);
  const won = Number(wl.won), lost = Number(wl.lost);
  const settled = won + lost;

  return {
    volume: Number(vol.v),
    activeMarkets: Math.max(0, totalMarkets - resolved),
    totalMarkets,
    users: Number(usr.n),
    predictors: Number(pred.n),
    startups: Number(st.n),
    resolved,
    winRate: settled > 0 ? +((won / settled) * 100).toFixed(1) : 0,
  };
}
