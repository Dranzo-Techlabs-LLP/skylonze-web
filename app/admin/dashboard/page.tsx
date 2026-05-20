"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, LogOut, ShieldCheck, Users, Coins, Plus, Minus,
  Ban, CheckCircle2, X, AlertCircle, Check,
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

export default function AdminDashboard() {
  const [users, setUsers] = useState<Me[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<Me | null>(null);
  const [adj, setAdj] = useState({ amount: "", note: "" });
  const [note, setNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function load(search = "") {
    setLoading(true);
    try {
      const { users } = await apiGet<{ users: Me[] }>(`/api/admin/users?q=${encodeURIComponent(search)}`);
      setUsers(users);
    } catch {
      router.push("/admin");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  const stats = useMemo(() => {
    const total = users.length;
    const supply = users.reduce((a, u) => a + Number(u.sky_balance), 0);
    const suspended = users.filter((u) => u.status === "suspended").length;
    return { total, supply, suspended };
  }, [users]);

  async function logout() {
    await apiSend("/api/admin/logout", "POST").catch(() => {});
    router.push("/admin");
    router.refresh();
  }

  async function act(id: number, body: any, okMsg: string) {
    setNote(null); setBusy(true);
    try {
      const { user } = await apiSend<{ user: Me }>(`/api/admin/users/${id}`, "PATCH", body);
      setUsers((prev) => prev.map((u) => (u.id === id ? user : u)));
      if (active?.id === id) setActive(user);
      setNote({ k: "ok", m: okMsg });
    } catch (err: any) {
      setNote({ k: "err", m: err.message });
    } finally { setBusy(false); }
  }

  return (
    <div className="min-h-dvh">
      {/* Admin top bar */}
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
        {/* stats */}
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

        {/* search */}
        <form
          onSubmit={(e) => { e.preventDefault(); load(q); }}
          className="relative max-w-md"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, email, handle…"
            className="h-11 w-full rounded-xl border border-violet-400/25 bg-white/5 pl-10 pr-3 text-sm outline-none focus:border-violet-400/70"
          />
        </form>

        {note && (
          <p className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${note.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
            {note.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {note.m}
          </p>
        )}

        {/* users table */}
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
                  <span className="hidden md:block col-span-2">
                    <Badge tone={u.role === "admin" ? "pink" : "violet"}>{u.role}</Badge>
                  </span>
                  <span className="col-span-1 md:col-span-2 md:text-right font-display text-sm font-bold tabular text-gradient inline-flex md:justify-end items-center gap-1">
                    <SkyCoin size={14} /> {formatSky(Number(u.sky_balance))}
                  </span>
                  <span className="hidden md:flex col-span-1 justify-center">
                    {u.status === "active"
                      ? <CheckCircle2 className="h-4 w-4 text-success" />
                      : <Ban className="h-4 w-4 text-danger" />}
                  </span>
                  <div className="col-span-1 md:col-span-2 flex md:justify-end gap-2">
                    <Button size="sm" variant="secondary" onClick={() => { setActive(u); setAdj({ amount: "", note: "" }); setNote(null); }}>
                      Manage
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      {/* Manage modal */}
      {active && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActive(null)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar seed={active.avatar_seed || active.handle} size={40} />
                <div className="min-w-0">
                  <p className="truncate font-display font-bold">{active.name}</p>
                  <p className="truncate text-[11px] text-ink-400">@{active.handle}</p>
                </div>
              </div>
              <button onClick={() => setActive(null)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-violet-400/20 bg-white/[0.03] p-4">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Balance</p>
              <p className="font-display text-2xl font-bold tabular text-gradient">{formatSky(Number(active.sky_balance))} SKY</p>
            </div>

            {/* adjust balance */}
            <div className="mt-4 space-y-3">
              <Input label="Adjust amount" type="number" value={adj.amount}
                onChange={(e) => setAdj({ ...adj, amount: e.target.value })}
                placeholder="e.g. 1000 or -500" />
              <Input label="Note (optional)" value={adj.note}
                onChange={(e) => setAdj({ ...adj, note: e.target.value })}
                placeholder="Reason for adjustment" />
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

            {note && (
              <p className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${note.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
                {note.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {note.m}
              </p>
            )}

            {/* status */}
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
    </div>
  );
}
