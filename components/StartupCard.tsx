"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Users, X, Check, AlertCircle } from "lucide-react";
import type { Startup } from "@/lib/data";
import { Card } from "./Card";
import { Badge } from "./Badge";
import { SkyCoin } from "./SkyCoin";
import { Button } from "./Button";
import { Input } from "./Input";
import { formatSky, formatBalance } from "@/lib/utils";
import { apiSend } from "@/lib/client";
import { useAuth } from "./AuthProvider";

function Logo({ seed, src }: { seed: string; src?: string | null }) {
  if (src) {
    return (
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-violet-400/30 bg-bg-900"
        style={{ boxShadow: "0 0 18px rgba(168,123,255,0.35)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" className="h-full w-full object-cover" draggable={false} />
      </div>
    );
  }
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const rot = h % 360;
  return (
    <div
      className="flex h-12 w-12 items-center justify-center rounded-2xl border border-violet-400/30"
      style={{
        background: `conic-gradient(from ${rot}deg, #C5A6FF, #FF7BD5, #7BEAFF, #C5A6FF)`,
        boxShadow: "0 0 18px rgba(168,123,255,0.35)",
      }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-900 font-display text-sm font-bold text-gradient">
        {seed.slice(0, 1).toUpperCase()}
      </span>
    </div>
  );
}

const PRESETS = [100, 500, 1000];

export function StartupCard({ s, index = 0 }: { s: Startup; index?: number }) {
  const { user, refresh } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("500");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [raised, setRaised] = useState(s.raised);
  const [backed, setBacked] = useState(false);

  function openModal() {
    if (!user) {
      router.push("/login?next=/startups");
      return;
    }
    setNote(null);
    setBacked(false);
    setAmount("500");
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setNote(null);
    setBusy(true);
    try {
      const r = await apiSend<{ raised: number; balance: number }>("/api/startups/invest", "POST", {
        startupId: s.id,
        amount: Number(amount),
      });
      setRaised(r.raised);
      setBacked(true);
      setNote({ k: "ok", m: `You invested ${formatSky(Number(amount))} SKY in ${s.name}.` });
      await refresh();
    } catch (err: any) {
      setNote({ k: "err", m: err.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
      >
        <Card interactive className="h-full">
          <div className="flex items-start gap-4">
            <Logo seed={s.logoSeed} src={s.logoUrl} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-base font-semibold truncate">{s.name}</h3>
                <Badge tone="cyan" className="hidden sm:inline-flex">{s.sector}</Badge>
              </div>
              <p className="mt-1 text-xs text-ink-300 line-clamp-2">{s.pitch}</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Raised</p>
              <p className="font-display text-sm font-bold tabular">${formatSky(raised)}</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Valuation</p>
              <p className="font-display text-sm font-bold tabular">${formatSky(s.valuation)}</p>
            </div>
            <div className="rounded-xl bg-white/[0.04] p-2.5 border border-violet-400/15">
              <p className="text-[10px] uppercase tracking-wider text-ink-400">Growth</p>
              <p className="inline-flex items-center justify-center gap-1 font-display text-sm font-bold tabular text-success">
                <TrendingUp className="h-3 w-3" /> +{s.growth}%
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-xs text-ink-400">
              <Users className="h-3.5 w-3.5" /> Founders: {s.founders}
            </span>
            <Button size="sm" variant="secondary" onClick={openModal}>
              <SkyCoin size={14} spin={false} /> Invest
            </Button>
          </div>
        </Card>
      </motion.div>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative w-full max-w-md glass-strong rounded-3xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <Logo seed={s.logoSeed} src={s.logoUrl} />
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-lg font-bold">{s.name}</h3>
                    <p className="truncate text-[11px] text-ink-400">{s.sector}</p>
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-violet-400/20 bg-white/[0.03] px-4 py-3">
                <span className="text-xs text-ink-400">Your balance</span>
                <span className="inline-flex items-center gap-1 font-display text-sm font-bold tabular text-gradient">
                  <SkyCoin size={14} /> {user ? formatBalance(user.sky_balance) : "—"} SKY
                </span>
              </div>

              <form className="mt-4 space-y-4" onSubmit={submit}>
                <div className="flex gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setAmount(String(p))}
                      className={`flex-1 rounded-xl border px-2 py-2 text-xs font-medium transition ${
                        Number(amount) === p
                          ? "border-violet-400/70 bg-violet-500/15 text-white"
                          : "border-violet-400/20 text-ink-300 hover:text-white"
                      }`}
                    >
                      {formatSky(p)}
                    </button>
                  ))}
                </div>
                <Input
                  label="Amount to back (SKY)"
                  type="number"
                  min={50}
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500"
                  hint="Minimum 50 SKY"
                />
                {note && (
                  <p className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${note.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
                    {note.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {note.m}
                  </p>
                )}
                {backed ? (
                  <Button type="button" className="w-full" variant="secondary" onClick={() => setOpen(false)}>
                    Done
                  </Button>
                ) : (
                  <Button type="submit" className="w-full" disabled={busy}>
                    {busy ? "Investing…" : <><SkyCoin size={16} spin={false} /> Invest in this startup</>}
                  </Button>
                )}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
