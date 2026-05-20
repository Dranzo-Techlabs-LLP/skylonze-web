"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, ChevronRight, AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { apiSend, type Me } from "@/lib/client";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setUser } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const { user } = await apiSend<{ user: Me }>("/api/auth/login", "POST", form);
      setUser(user);
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      router.push(next.startsWith("/") ? next : "/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={<>Welcome back to <span className="text-gradient">SKYLONZE</span></>}
      subtitle="Sign in to your forecasting profile."
    >
      <form className="space-y-4" onSubmit={submit}>
        <Input
          label="Email" type="email" name="email" autoComplete="email" required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          startSlot={<Mail className="h-4 w-4" />} placeholder="you@skylonze.com"
        />
        <Input
          label="Password" type="password" name="password" autoComplete="current-password" required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          startSlot={<Lock className="h-4 w-4" />} placeholder="••••••••"
        />
        <div className="flex items-center justify-end text-xs">
          <Link href="/forgot" className="text-violet-300 hover:text-white">Forgot password?</Link>
        </div>

        {error && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert"
            className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Signing in…" : <>Sign in <ChevronRight className="h-4 w-4" /></>}
        </Button>
        <p className="text-center text-xs text-ink-400">
          New here?{" "}
          <Link href="/signup" className="text-violet-300 hover:text-white">Create an account</Link>
        </p>
      </form>
    </AuthShell>
  );
}
