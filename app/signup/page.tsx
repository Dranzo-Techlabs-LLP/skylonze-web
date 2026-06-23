"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, User, Lock, AtSign, ChevronRight, AlertCircle } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Turnstile, turnstileConfigured } from "@/components/Turnstile";
import { apiSend, type Me } from "@/lib/client";
import { useAuth } from "@/components/AuthProvider";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", handle: "", email: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  // Anti-bot: honeypot field + form-render timestamp + optional captcha token.
  const [company, setCompany] = useState(""); // honeypot — must stay empty
  const [captcha, setCaptcha] = useState<string | null>(null);
  const mountedAt = useRef<number>(Date.now());
  const router = useRouter();
  const { setUser } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!agree) { setError("Please accept the terms to continue."); return; }
    if (turnstileConfigured && !captcha) { setError("Please complete the captcha."); return; }
    setBusy(true);
    try {
      const { user } = await apiSend<{ user: Me }>("/api/auth/signup", "POST", {
        ...form,
        company,
        formTime: Date.now() - mountedAt.current,
        turnstileToken: captcha,
      });
      setUser(user);
      setOk(true);
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <AuthShell
      title={<>Create your <span className="text-gradient">SKYLONZE</span> profile</>}
      subtitle="Get 500 SKY-3030 to start forecasting in seconds."
    >
      <form className="space-y-4" onSubmit={submit}>
        {/* Honeypot — visually hidden; bots that auto-fill every field trip it. */}
        <div aria-hidden className="pointer-events-none absolute -left-[9999px] h-0 w-0 overflow-hidden" style={{ opacity: 0 }}>
          <label>
            Company
            <input
              type="text" name="company" tabIndex={-1} autoComplete="off"
              value={company} onChange={(e) => setCompany(e.target.value)}
            />
          </label>
        </div>
        <Input
          label="Full name" name="name" autoComplete="name" required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          startSlot={<User className="h-4 w-4" />} placeholder="Aria Forecaster"
        />
        <Input
          label="Username" name="handle" required
          value={form.handle}
          onChange={(e) => setForm({ ...form, handle: e.target.value.replace(/\s+/g, "") })}
          startSlot={<AtSign className="h-4 w-4" />} placeholder="aria.sky"
          hint="3-30 chars: a-z 0-9 . _ -"
        />
        <Input
          label="Email" type="email" name="email" autoComplete="email" required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          startSlot={<Mail className="h-4 w-4" />} placeholder="you@skylonze.com"
        />
        <Input
          label="Password" type="password" name="password" autoComplete="new-password"
          required minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          startSlot={<Lock className="h-4 w-4" />} placeholder="Min 8 chars, letters + numbers"
        />
        <label className="flex items-start gap-2 text-[11px] text-ink-300">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 accent-violet-500" />
          <span>I agree to the SKYLONZE terms and acknowledge SKY-3030 is a virtual ecosystem currency.</span>
        </label>

        {turnstileConfigured && <Turnstile onToken={setCaptcha} />}

        {error && (
          <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert"
            className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
            <AlertCircle className="h-4 w-4 shrink-0" /> {error}
          </motion.p>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={busy}>
          {busy ? "Creating…" : ok ? "Redirecting…" : <>Claim 500 SKY <ChevronRight className="h-4 w-4" /></>}
        </Button>
        <p className="text-center text-xs text-ink-400">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-300 hover:text-white">Sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
