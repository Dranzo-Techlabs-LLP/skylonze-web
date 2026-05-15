"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  return (
    <AuthShell
      title={<>Welcome back to <span className="text-gradient">SKYLONZE</span></>}
      subtitle="Sign in to your forecasting profile."
    >
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          startSlot={<Mail className="h-4 w-4" />}
          placeholder="you@skylonze.com"
        />
        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          startSlot={<Lock className="h-4 w-4" />}
          placeholder="••••••••"
        />
        <div className="flex items-center justify-between text-xs">
          <label className="inline-flex items-center gap-2 text-ink-300">
            <input type="checkbox" className="accent-violet-500" /> Remember me
          </label>
          <Link href="/forgot" className="text-violet-300 hover:text-white">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" size="lg" className="w-full">
          Sign in <ChevronRight className="h-4 w-4" />
        </Button>
        <div className="relative my-2 flex items-center justify-center">
          <span className="h-px flex-1 bg-violet-400/15" />
          <span className="px-3 text-[10px] uppercase tracking-wider text-ink-400">or</span>
          <span className="h-px flex-1 bg-violet-400/15" />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" size="md" className="w-full">Continue with Google</Button>
          <Button type="button" variant="outline" size="md" className="w-full">Continue with Apple</Button>
        </div>
        <p className="text-center text-xs text-ink-400">
          New here?{" "}
          <Link href="/signup" className="text-violet-300 hover:text-white">
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
