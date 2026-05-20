"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ShieldCheck, AlertCircle, ChevronRight } from "lucide-react";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { SLogo } from "@/components/SLogo";
import { apiSend } from "@/lib/client";

export const dynamic = "force-dynamic";

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setBusy(true);
    try {
      await apiSend("/api/admin/login", "POST", form);
      router.push("/admin/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/20 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md glass-strong rounded-3xl p-7 sm:p-8"
      >
        <div className="flex items-center gap-3">
          <SLogo size={40} />
          <div>
            <p className="font-display text-sm font-bold uppercase tracking-[0.12em]">
              Skyl<span className="text-gradient">onze</span>
            </p>
            <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-violet-300">
              <ShieldCheck className="h-3 w-3" /> Admin portal
            </p>
          </div>
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold">Restricted access</h1>
        <p className="mt-1 text-sm text-ink-400">Authorized administrators only.</p>

        <form className="mt-6 space-y-4" onSubmit={submit}>
          <Input label="Admin email" type="email" name="email" autoComplete="email" required
            value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            startSlot={<Mail className="h-4 w-4" />} placeholder="admin@skylonze.com" />
          <Input label="Password" type="password" name="password" autoComplete="current-password" required
            value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            startSlot={<Lock className="h-4 w-4" />} placeholder="••••••••" />

          {error && (
            <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert"
              className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
              <AlertCircle className="h-4 w-4 shrink-0" /> {error}
            </motion.p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? "Verifying…" : <>Enter admin <ChevronRight className="h-4 w-4" /></>}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
