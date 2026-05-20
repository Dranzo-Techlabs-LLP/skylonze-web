"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, LogOut, ShieldCheck, Users, Coins, Plus, Minus,
  Ban, CheckCircle2, X, AlertCircle, Check, Gavel, TrendingUp,
} from "lucide-react";
import { SLogo } from "@/components/SLogo";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Avatar } from "@/components/Avatar";
import { Badge } from "@/components/Badge";
import { SkyCoin } from "@/components/SkyCoin";
import { apiGet, apiSend, type Me } from "@/lib/client";
import { formatSky } from "@/lib/utils";

export const dynamic = "force-dynamic";

type AdminMarket = {
  id: string;
  title: string;
  category: string;
  yes: number;
  closes: string;
  open: number;
  staked: number;
  resolution: {
    outcome: "YES" | "NO";
    won_count: number;
    lost_count: number;
    paid_out: number;
    distributed: number;
  } | null;
  pending: { count: number; total: number };
};

export default function AdminDashboard() {
  const [tab, setTab] = useState<"users" | "markets">("users");
  const [users, setUsers] = useState<Me[]>([]);
  const [markets, setMarkets] = useState<AdminMarket[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Me | null>(null);
  const [adj, setAdj] = useState({ amount: "", note: "" });
  const [note, setNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [revealTarget, setRevealTarget] = useState<AdminMarket | null>(null);
  const router = useRouter();

  async function loadUsers(search = "") {
    setLoading(true);
    try {
      const { users } = await apiGet<{ users: Me[] }>(`/api/admin/users?q=${encodeURIComponent(search)}`);
      setUsers(users);
    } catch { router.push("/admin"); }
    finally { setLoading(false); }
  }
  async function loadMarkets() {
    setLoading(true);
    try {
      const { markets } = await apiGet<{ markets: AdminMarket[] }>("/api/admin/markets");
      setMarkets(markets);
    } catch { router.push("/admin"); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadUsers(); }, []);
  useEffect(() => { if (tab === "markets") loadMarkets(); }, [tab]);

  const stats = useMemo(() => {
    const total = users.length;
    const supply = users.reduce((a, u) => a + Number(u.sky_balance), 0);
    const suspended = users.filter((u) => u.status === "suspended").length;
    return { total, supply, suspended };
  }, [users]);

  async function logout() {
    await apiSend("/api/admin/logout", "POST").catch(() => {});
    router.push("/admin"); router.refresh();
  }

  async function act(id: number, body: any, okMsg: string) {
    setNote(null); setBusy(true);
    try {
      const { user } = await apiSend<{ user: Me }>(`/api/admin/users/${id}`, "PATCH", body);
      setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
      if (active?.id === id) setActive(user);
      setNote({ k: "ok", m: okMsg });
    } catch (err: any) { setNote({ k: "err", m: err.message }); }
    finally { setBusy(false); }
  }

  async function reveal(outcome: "YES" | "NO") {
    if (!revealTarget) return;
    setBusy(true); setNote(null);
    try {
      const r = await apiSend<{ won: number; lost: number; pending: number }>(
        "/api/admin/markets/reveal", "POST", { marketId: revealTarget.id, outcome },
      );
      setNote({ k: "ok", m: `Result set: ${revealTarget.title} → ${outcome}. ${r.won} won, ${r.lost} lost. ${formatSky(r.pending)} SKY pending payout.` });
      setRevealTarget(null);
      await loadMarkets();
    } catch (err: any) { setNote({ k: "err", m: err.message }); }
    finally { setBusy(false); }
  }

  async function distribute(m: AdminMarket) {
    setBusy(true); setNote(null);
    try {
      const r = await apiSend<{ winners: number; paid: number }>(
        "/api/admin/markets/distribute", "POST", { marketId: m.id },
      );
      setNote({ k: "ok", m: `Distributed ${formatSky(r.paid)} SKY to ${r.winners} winner(s) on ${m.title}.` });
      await loadMarkets();
    } catch (err: any) { setNote({ k: "err", m: err.message }); }
    finally { setBusy(false); }
  }

  return (
    <div className="min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-violet-400/15 bg-bg-900/85 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <SLogo size={32} />
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.12em]">
                Skyl<span className="text-gradient">onze</span>
              </p>
              <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-violet-300">
                <ShieldCheck className="h-3 w-3" /> Admin
              </p>
            </div>
          </div>
          <Button variant="secondary" size="sm" onClick={logout}><LogOut className="h-4 w-4" /> Log out</Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: Users, label: "Total users", value: stats.total.toLocaleString() },
            { icon: Coins, label: "SKY in circulation", value: formatSky(stats.supply) },
            { icon: Ban, label: "Suspended", value: stats.suspended.toLocaleString() },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 text-violet-300">
                <s.icon className="h-4 w-4" />
                <p className="text-[10px] uppercase tracking-wider text-ink-400">{s.label}</p>
              </div>
              <p className="mt-2 font-display text-2xl font-bold tabular text-gradient">{s.value}</p>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div className="flex gap-2">
          {(["users", "markets"] as const).map((t) => (
            <button key={t} onClick={() => { setTab(t); setNote(null); }}
              className={`h-9 rounded-full px-4 text-xs font-medium capitalize transition ${
                tab === t ? "bg-gradient-to-r from-violet-600 to-neon-pink text-white shadow-glow" : "border border-violet-400/20 text-ink-300 hover:text-white"
              }`}>
              {t}
            </button>
          ))}
        </div>

        {note && (
          <p className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${note.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
            {note.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {note.m}
          </p>
        )}

        {tab === "users" ? (
          <>
            <form onSubmit={(e) => { e.preventDefault(); loadUsers(q); }} className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, email, handle…"
                className="h-11 w-full rounded-xl border border-violet-400/25 bg-white/5 pl-10 pr-3 text-sm outline-none focus:border-violet-400/70" />
            </form>

            <div className="glass rounded-3xl overflow-hidden">
              <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-400 border-b border-violet-400/15">
                <span className="col-span-1">ID</span>
                <span className="col-span-4">User</span>
                <span className="col-span-2">Role</span>
                <span className="col-span-2 text-right">Balance</span>
                <span className="col-span-1 text-center">Status</span>
                <span className="col-span-2 text-right">Actions</span>
              </div>
              {loading ? (
                <div className="p-10 text-center text-ink-400 text-sm">Loading…</div>
              ) : users.length === 0 ? (
                <div className="p-10 text-center text-ink-400 text-sm">No users.</div>
              ) : (
                <ul className="divide-y divide-violet-400/10">
                  {users.map((u) => (
                    <li key={u.id} className="grid grid-cols-2 md:grid-cols-12 items-center gap-3 px-5 py-4">
                      <span className="hidden md:block col-span-1 text-xs tabular text-ink-400">#{u.id}</span>
                      <div className="col-span-2 md:col-span-4 flex items-center gap-3 min-w-0">
                        <Avatar seed={u.avatar_seed || u.handle} size={34} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{u.name}</p>
                          <p className="truncate text-[11px] text-ink-400">@{u.handle} · {u.email}</p>
                        </div>
                      </div>
                      <span className="hidden md:block col-span-2"><Badge tone={u.role === "admin" ? "pink" : "violet"}>{u.role}</Badge></span>
                      <span className="col-span-1 md:col-span-2 md:text-right font-display text-sm font-bold tabular text-gradient inline-flex md:justify-end items-center gap-1">
                        <SkyCoin size={14} /> {formatSky(Number(u.sky_balance))}
                      </span>
                      <span className="hidden md:flex col-span-1 justify-center">
                        {u.status === "active" ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Ban className="h-4 w-4 text-danger" />}
                      </span>
                      <div className="col-span-1 md:col-span-2 flex md:justify-end gap-2">
                        <Button size="sm" variant="secondary" onClick={() => { setActive(u); setAdj({ amount: "", note: "" }); setNote(null); }}>Manage</Button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        ) : (
          <div className="glass rounded-3xl overflow-hidden">
            <div className="hidden md:grid grid-cols-12 px-5 py-3 text-[10px] uppercase tracking-[0.18em] text-ink-400 border-b border-violet-400/15">
              <span className="col-span-4">Market</span>
              <span className="col-span-2 text-right">Open bets</span>
              <span className="col-span-2 text-right">Staked</span>
              <span className="col-span-4 text-right">Result / Payout</span>
            </div>
            {loading ? (
              <div className="p-10 text-center text-ink-400 text-sm">Loading…</div>
            ) : (
              <ul className="divide-y divide-violet-400/10">
                {markets.map((m) => (
                  <li key={m.id} className="grid grid-cols-1 md:grid-cols-12 items-center gap-3 px-5 py-4">
                    <div className="md:col-span-4 min-w-0">
                      <p className="truncate text-sm font-medium">{m.title}</p>
                      <p className="truncate text-[11px] text-ink-400">{m.category} · closes {m.closes} · YES {m.yes}%</p>
                    </div>
                    <span className="md:col-span-2 md:text-right text-xs tabular text-ink-200">
                      <span className="md:hidden text-ink-400">Open · </span>{m.open}
                    </span>
                    <span className="md:col-span-2 md:text-right text-xs tabular inline-flex items-center md:justify-end gap-1">
                      <SkyCoin size={12} /> {formatSky(m.staked)}
                    </span>
                    <div className="md:col-span-4 flex flex-wrap items-center md:justify-end gap-2">
                      {!m.resolution ? (
                        <Button size="sm" variant="secondary" onClick={() => { setRevealTarget(m); setNote(null); }}>
                          <Gavel className="h-4 w-4" /> Set result
                        </Button>
                      ) : m.resolution.distributed ? (
                        <>
                          <Badge tone={m.resolution.outcome === "YES" ? "success" : "danger"}>
                            Result · {m.resolution.outcome}
                          </Badge>
                          <Badge tone="violet" className="gap-1"><Check className="h-3 w-3" /> Paid {formatSky(m.resolution.paid_out)}</Badge>
                        </>
                      ) : (
                        <>
                          <Badge tone={m.resolution.outcome === "YES" ? "success" : "danger"}>
                            Result · {m.resolution.outcome}
                          </Badge>
                          <Button size="sm" disabled={busy} onClick={() => distribute(m)}>
                            <Coins className="h-4 w-4" /> Distribute {m.pending.count > 0 ? `${m.pending.count} · ${formatSky(m.pending.total)}` : ""}
                          </Button>
                        </>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      {/* Manage user modal */}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActive(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-strong rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar seed={active.avatar_seed || active.handle} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-display font-bold">{active.name}</p>
                  <p className="truncate text-[11px] text-ink-400">@{active.handle}</p>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <div className="mt-4 rounded-2xl border border-violet-400/20 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Balance</p>
              <p className="font-display text-2xl font-bold tabular text-gradient">{formatSky(Number(active.sky_balance))} SKY</p>
            </div>
            <div className="mt-4 space-y-3">
              <Input label="Adjust amount" type="number" value={adj.amount}
                onChange={(e) => setAdj({ ...adj, amount: e.target.value })} placeholder="e.g. 1000 or -500" />
              <Input label="Note (optional)" value={adj.note}
                onChange={(e) => setAdj({ ...adj, note: e.target.value })} placeholder="Reason for adjustment" />
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" variant="secondary" disabled={busy}
                  onClick={() => act(active.id, { action: "adjust", amount: Math.abs(Number(adj.amount || 0)), note: adj.note }, "Credited.")}>
                  <Plus className="h-4 w-4" /> Credit
                </Button>
                <Button size="sm" variant="secondary" disabled={busy}
                  onClick={() => act(active.id, { action: "adjust", amount: -Math.abs(Number(adj.amount || 0)), note: adj.note }, "Debited.")}>
                  <Minus className="h-4 w-4" /> Debit
                </Button>
              </div>
            </div>
            <div className="mt-4 border-t border-violet-400/15 pt-4">
              {active.status === "active" ? (
                <Button size="sm" variant="outline" className="w-full text-danger border-danger/40" disabled={busy || active.role === "admin"}
                  onClick={() => act(active.id, { action: "suspend" }, "User suspended.")}>
                  <Ban className="h-4 w-4" /> Suspend account
                </Button>
              ) : (
                <Button size="sm" variant="outline" className="w-full text-success border-success/40" disabled={busy}
                  onClick={() => act(active.id, { action: "activate" }, "User reactivated.")}>
                  <CheckCircle2 className="h-4 w-4" /> Reactivate account
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Reveal result modal */}
      {revealTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setRevealTarget(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-strong rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Set market result</h3>
              <button onClick={() => setRevealTarget(null)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <p className="mt-2 text-sm text-ink-200">{revealTarget.title}</p>
            <p className="mt-1 text-xs text-ink-400">
              {revealTarget.open} open prediction(s) · {formatSky(revealTarget.staked)} SKY staked.
              Setting the result marks winners and losers. You then distribute the
              winnings in a second step. This cannot be undone.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <Button variant="secondary" disabled={busy} className="border-success/50 text-success"
                onClick={() => reveal("YES")}>
                <TrendingUp className="h-4 w-4" /> Result: YES
              </Button>
              <Button variant="secondary" disabled={busy} className="border-danger/50 text-danger"
                onClick={() => reveal("NO")}>
                <Gavel className="h-4 w-4" /> Result: NO
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
