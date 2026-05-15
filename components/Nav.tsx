"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { SkyCoin } from "./SkyCoin";
import { cn } from "@/lib/utils";

const links = [
  { href: "/markets", label: "Markets" },
  { href: "/leaderboard", label: "Leaderboard" },
  { href: "/startups", label: "Startups" },
  { href: "/wallet", label: "Wallet" },
  { href: "/dashboard", label: "Dashboard" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-violet-400/15 bg-bg-900/75 backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="SKYLONZE home">
          <Logo />
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 text-sm text-ink-200 hover:text-white hover:bg-white/5 transition"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link
            href="/wallet"
            className="flex h-10 items-center gap-2 rounded-xl border border-violet-400/30 bg-white/5 px-3 text-sm font-medium hover:border-violet-400/60 transition"
          >
            <SkyCoin size={20} />
            <span className="tabular">12,480</span>
            <span className="text-ink-400">SKY</span>
          </Link>
          <Link href="/login">
            <Button variant="secondary" size="sm">Sign in</Button>
          </Link>
          <Link href="/signup">
            <Button size="sm">Get started <ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-violet-400/25 bg-white/5"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden overflow-hidden border-t border-violet-400/15 bg-bg-900/95 backdrop-blur-xl"
          >
            <div className="mx-auto max-w-7xl px-4 py-4 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-ink-100 hover:bg-white/5"
                >
                  {l.label}
                  <ChevronRight className="h-4 w-4 text-ink-400" />
                </Link>
              ))}
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="secondary" className="w-full">Sign in</Button>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full">Get started</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
