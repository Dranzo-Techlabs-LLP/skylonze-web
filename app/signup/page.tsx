"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, User, Lock, AtSign, ChevronRight } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export default function SignupPage() {
  const [form, setForm] = useState({ name: "", handle: "", email: "", password: "" });
  const [submitted, setSubmitted] = useState(false);

  return (
    <AuthShell
      title={<>Create your <span className="text-gradient">SKYLONZE</span> profile</>}
      subtitle="Get 5,000 SKY-3030 to start forecasting in seconds."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <Input
          label="Full name"
          name="name"
          autoComplete="name"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          startSlot={<User className="h-4 w-4" />}
          placeholder="Aria Forecaster"
        />
        <Input
          label="Handle"
          name="handle"
          required
          value={form.handle}
          onChange={(e) => setForm({ ...form, handle: e.target.value.replace(/\s+/g, "") })}
          startSlot={<AtSign className="h-4 w-4" />}
          placeholder="aria.sky"
          hint="Lowercase, no spaces"
        />
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
          autoComplete="new-password"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          startSlot={<Lock className="h-4 w-4" />}
          placeholder="At least 8 characters"
        />
        <label className="flex items-start gap-2 text-[11px] text-ink-300">
          <input type="checkbox" required className="mt-0.5 accent-violet-500" />
          <span>
            I agree to the SKYLONZE terms and acknowledge SKY-3030 is a virtual ecosystem currency.
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full">
          Claim 5,000 SKY <ChevronRight className="h-4 w-4" />
        </Button>
        {submitted && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-success"
          >
            Profile created! Redirecting to your dashboard…
          </motion.p>
        )}
        <p className="text-center text-xs text-ink-400">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-300 hover:text-white">
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
