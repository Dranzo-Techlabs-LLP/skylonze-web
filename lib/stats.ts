import { query } from "./db";
import { getAllSettings, STAT_KEYS } from "./site-settings";

export type PlatformStats = {
  volume: number;
  activeMarkets: number;
  totalMarkets: number;
  users: number;
  predictors: number;
  startups: number;
  resolved: number;
  winRate: number;
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

  const computed: PlatformStats = {
    volume: Number(vol.v),
    activeMarkets: Math.max(0, totalMarkets - resolved),
    totalMarkets,
    users: Number(usr.n),
    predictors: Number(pred.n),
    startups: Number(st.n),
    resolved,
    winRate: settled > 0 ? +((won / settled) * 100).toFixed(1) : 0,
  };

  // Admin overrides via site_settings (empty string = use computed)
  const settings = await getAllSettings();
  for (const k of STAT_KEYS) {
    const v = settings[`stats.${k}`];
    if (v !== undefined && v !== "") {
      const n = Number(v);
      if (!Number.isNaN(n)) (computed as any)[k] = n;
    }
  }
  return computed;
}
