"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, ChevronRight } from "lucide-react";
import { AuthShell } from "@/components/AuthShell";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { motion } from "framer-motion";

export default function ForgotPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  return (
    <AuthShell
      title={<>Reset your <span className="text-gradient">password</span></>}
      subtitle="Enter your account email and we'll send you a reset link."
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
      >
        <Input
          label="Email"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          startSlot={<Mail className="h-4 w-4" />}
          placeholder="you@skylonze.com"
        />
        <Button type="submit" size="lg" className="w-full">
          Send reset link <ChevronRight className="h-4 w-4" />
        </Button>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-xs text-success"
          >
            If an account exists for {email}, a reset link is on the way.
          </motion.p>
        )}
        <p className="text-center text-xs text-ink-400">
          Remembered it?{" "}
          <Link href="/login" className="text-violet-300 hover:text-white">Back to sign in</Link>
        </p>
      </form>
    </AuthShell>
  );
}
