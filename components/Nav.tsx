"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronRight, LogOut, Settings, User as UserIcon } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "./Button";
import { SkyCoin } from "./SkyCoin";
import { Avatar } from "./Avatar";
import { cn, formatSky } from "@/lib/utils";
import { fetchMe, apiSend, type Me } from "@/lib/client";

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
  const [me, setMe] = useState<Me | null>(null);
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    fetchMe().then((u) => { setMe(u); setLoading(false); });
  }, []);

  async function logout() {
    await apiSend("/api/auth/logout", "POST").catch(() => {});
    setMe(null);
    setMenu(false);
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  // Hidden admin area renders its own chrome
  if (pathname?.startsWith("/admin")) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled ? "border-b border-violet-400/15 bg-bg-900/75 backdrop-blur-xl" : "bg-transparent",
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
          {me ? (
            <>
              <Link
                href="/wallet"
                className="flex h-10 items-center gap-2 rounded-xl border border-violet-400/30 bg-white/5 px-3 text-sm font-medium hover:border-violet-400/60 transition"
              >
                <SkyCoin size={20} />
                <span className="tabular">{formatSky(me.sky_balance)}</span>
                <span className="text-ink-400">SKY</span>
              </Link>
              <div className="relative">
                <button
                  onClick={() => setMenu((v) => !v)}
                  className="flex items-center gap-2 rounded-xl border border-violet-400/30 bg-white/5 px-2 py-1.5 hover:border-violet-400/60 transition"
                  aria-haspopup="menu"
                  aria-expanded={menu}
                >
                  <Avatar seed={me.avatar_seed || me.handle} size={28} />
                  <span className="text-sm max-w-[110px] truncate">{me.name}</span>
                </button>
                <AnimatePresence>
                  {menu && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-violet-400/20 bg-bg-800/95 backdrop-blur-xl shadow-glow"
                      role="menu"
                    >
                      <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                        <UserIcon className="h-4 w-4 text-violet-300" /> Dashboard
                      </Link>
                      <Link href="/settings" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-white/5">
                        <Settings className="h-4 w-4 text-violet-300" /> Settings
                      </Link>
                      <button onClick={logout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-white/5">
                        <LogOut className="h-4 w-4" /> Log out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <>
              <Link href="/login"><Button variant="secondary" size="sm">Sign in</Button></Link>
              <Link href="/signup"><Button size="sm">Get started <ChevronRight className="h-4 w-4" /></Button></Link>
            </>
          )}
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
              {me && (
                <div className="mb-3 flex items-center gap-3 rounded-xl border border-violet-400/20 bg-white/5 px-3 py-3">
                  <Avatar seed={me.avatar_seed || me.handle} size={36} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{me.name}</p>
                    <p className="truncate text-[11px] text-ink-400">@{me.handle}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs tabular">
                    <SkyCoin size={16} /> {formatSky(me.sky_balance)}
                  </span>
                </div>
              )}
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
              {me ? (
                <div className="mt-3 space-y-1">
                  <Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm hover:bg-white/5">
                    <Settings className="h-4 w-4 text-violet-300" /> Settings
                  </Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm text-danger hover:bg-white/5">
                    <LogOut className="h-4 w-4" /> Log out
                  </button>
                </div>
              ) : (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    <Button variant="secondary" className="w-full">Sign in</Button>
                  </Link>
                  <Link href="/signup" onClick={() => setOpen(false)}>
                    <Button className="w-full">Get started</Button>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
