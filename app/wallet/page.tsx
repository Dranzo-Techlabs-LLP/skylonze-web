"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, TrendingUp, TrendingDown, Send, X, Check, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/Button";
import { SkyCoin } from "@/components/SkyCoin";
import { Input } from "@/components/Input";
import { Badge } from "@/components/Badge";
import { formatSky } from "@/lib/utils";
import { apiGet, apiSend, type Me } from "@/lib/client";

const MiniOrb = dynamic(() => import("@/components/MiniOrb").then((m) => m.MiniOrb), {
  ssr: false,
  loading: () => <div className="h-full w-full rounded-3xl bg-violet-700/20 animate-pulse" />,
});

type Txn = {
  id: number;
  type: "credit" | "debit";
  amount: number;
  balance_after: number;
  description: string;
  created_at: string;
};

export default function WalletPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [txns, setTxns] = useState<Txn[]>([]);
  const [loading, setLoading] = useState(true);
  const [showSend, setShowSend] = useState(false);
  const [send, setSend] = useState({ toHandle: "", amount: "" });
  const [sendNote, setSendNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [sending, setSending] = useState(false);

  async function load() {
    try {
      const { user, transactions } = await apiGet<{ user: Me; transactions: Txn[] }>("/api/wallet");
      setMe(user);
      setTxns(transactions);
    } catch {
      /* middleware redirects unauthenticated */
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); }, []);

  async function submitSend(e: React.FormEvent) {
    e.preventDefault();
    setSendNote(null); setSending(true);
    try {
      await apiSend("/api/wallet/transfer", "POST", { toHandle: send.toHandle, amount: Number(send.amount) });
      setSendNote({ k: "ok", m: `Sent ${send.amount} SKY to @${send.toHandle}.` });
      setSend({ toHandle: "", amount: "" });
      await load();
      setTimeout(() => setShowSend(false), 1200);
    } catch (err: any) {
      setSendNote({ k: "err", m: err.message });
    } finally { setSending(false); }
  }

  const earned = txns.filter((t) => t.type === "credit").reduce((a, t) => a + Number(t.amount), 0);
  const spent = txns.filter((t) => t.type === "debit").reduce((a, t) => a + Number(t.amount), 0);

  return (
    <>
      <PageHeader
        eyebrow="SKY-3030 wallet"
        title={<>Your <span className="text-gradient">prediction</span> economy.</>}
        description="Live SKY-3030 ledger — balance, transfers, payouts, and activity."
      />

      <section className="mx-auto max-w-7xl px-4 sm:px-6 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 gradient-border p-1 overflow-hidden"
        >
          <div className="relative rounded-2xl bg-bg-800/80 p-6 sm:p-8 grid items-center gap-6 sm:grid-cols-2 min-h-[260px]">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-300">Balance</p>
              <div className="mt-2 flex items-center gap-3">
                <SkyCoin size={48} />
                <div>
                  <p className="font-display text-4xl sm:text-5xl font-bold tabular text-gradient">
                    {loading ? "—" : (me?.sky_balance ?? 0).toLocaleString()}
                  </p>
                  <p className="text-xs text-ink-400">SKY-3030</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setShowSend(true)}><Send className="h-4 w-4" /> Send</Button>
                <Button size="sm" variant="secondary" onClick={load}><ArrowUpRight className="h-4 w-4" /> Refresh</Button>
              </div>
            </div>
            <div className="relative h-44 sm:h-56"><MiniOrb className="h-full w-full" /></div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          {[
            { label: "Lifetime earned", value: formatSky(earned), sub: "credits" },
            { label: "Lifetime spent", value: formatSky(spent), sub: "debits" },
            { label: "Transactions", value: String(txns.length), sub: "recorded" },
            { label: "Status", value: me?.status === "suspended" ? "Suspended" : "Active", sub: me ? `@${me.handle}` : "" },
          ].map((s) => (
            <div key={s.label} className="glass rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">{s.label}</p>
              <p className="mt-1 font-display text-xl font-bold tabular text-gradient">{s.value}</p>
              <p className="text-[11px] text-ink-400">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Transactions */}
        <div className="lg:col-span-3 glass rounded-3xl overflow-hidden">
          <div className="px-5 py-4 border-b border-violet-400/15 flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold">Activity</h3>
            <Badge tone="violet">{txns.length}</Badge>
          </div>
          {loading ? (
            <div className="p-10 text-center text-ink-400 text-sm">Loading…</div>
          ) : txns.length === 0 ? (
            <div className="p-10 text-center text-ink-400 text-sm">No transactions yet.</div>
          ) : (
            <ul className="divide-y divide-violet-400/10 max-h-[480px] overflow-auto">
              {txns.map((t) => {
                const inflow = t.type === "credit";
                return (
                  <li key={t.id} className="flex items-center gap-3 p-4">
                    <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${inflow ? "bg-success/15 text-success" : "bg-danger/15 text-danger"}`}>
                      {inflow ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{t.description}</p>
                      <p className="text-[11px] text-ink-400">{new Date(t.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <span className={`font-display tabular text-sm font-bold ${inflow ? "text-success" : "text-danger"}`}>
                        {inflow ? "+" : "-"}{formatSky(Number(t.amount))}
                      </span>
                      <p className="text-[10px] text-ink-400 tabular">bal {formatSky(Number(t.balance_after))}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* Send modal */}
      {showSend && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSend(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full max-w-md glass-strong rounded-3xl p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold">Send SKY-3030</h3>
              <button onClick={() => setShowSend(false)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form className="mt-4 space-y-4" onSubmit={submitSend}>
              <Input label="Recipient handle" required value={send.toHandle}
                onChange={(e) => setSend({ ...send, toHandle: e.target.value.replace(/\s+/g, "") })}
                placeholder="aria.sky" />
              <Input label="Amount (SKY)" type="number" min={1} required value={send.amount}
                onChange={(e) => setSend({ ...send, amount: e.target.value })}
                placeholder="500" />
              {sendNote && (
                <p className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${sendNote.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
                  {sendNote.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {sendNote.m}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={sending}>
                {sending ? "Sending…" : <>Send <Send className="h-4 w-4" /></>}
              </Button>
            </form>
          </motion.div>
        </div>
      )}
    </>
  );
}
