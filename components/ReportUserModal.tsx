"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Flag, X, Check, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { useAuth } from "./AuthProvider";
import { apiSend } from "@/lib/client";

const CATEGORIES = [
  { value: "hacking", label: "Hacking / account compromise" },
  { value: "cheating", label: "Cheating / collusion" },
  { value: "bug_exploit", label: "Bug exploitation" },
  { value: "policy", label: "Policy violation" },
  { value: "other", label: "Other suspicious activity" },
];

/** Small flag button + modal for reporting a user to the moderators. */
export function ReportUserButton({ handle }: { handle: string }) {
  const { user } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState("other");
  const [details, setDetails] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);

  // Don't show a report button for yourself.
  if (user && user.handle === handle) return null;

  function openModal() {
    if (!user) { router.push("/login"); return; }
    setNote(null); setDetails(""); setCategory("other");
    setOpen(true);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setNote(null); setBusy(true);
    try {
      await apiSend("/api/reports", "POST", { handle, category, details });
      setNote({ k: "ok", m: "Report submitted. Our team will review it." });
      setTimeout(() => setOpen(false), 1500);
    } catch (err: any) {
      setNote({ k: "err", m: err.message });
    } finally { setBusy(false); }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="rounded-lg border border-violet-400/20 p-1.5 text-ink-400 hover:text-danger hover:border-danger/40 transition"
        aria-label={`Report @${handle}`}
        title={`Report @${handle}`}
      >
        <Flag className="h-3.5 w-3.5" />
      </button>

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
                <h3 className="font-display text-lg font-bold inline-flex items-center gap-2">
                  <Flag className="h-5 w-5 text-danger" /> Report @{handle}
                </h3>
                <button onClick={() => setOpen(false)} className="rounded-lg p-1.5 hover:bg-white/5" aria-label="Close">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="mt-2 text-xs text-ink-400">
                Report suspicious activity — hacking, cheating, bug exploitation, or policy violations.
                Reports are confidential and reviewed by moderators.
              </p>

              <form className="mt-4 space-y-4" onSubmit={submit}>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-ink-400">Reason</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="h-11 w-full rounded-xl border border-violet-400/25 bg-white/5 px-3 text-sm outline-none focus:border-violet-400/70"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.value} value={c.value} className="bg-bg-800">{c.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-ink-400">Details (optional)</label>
                  <textarea
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    placeholder="What happened? Include market names, dates, anything that helps."
                    className="w-full rounded-xl border border-violet-400/25 bg-white/5 px-3 py-2 text-sm outline-none focus:border-violet-400/70"
                  />
                </div>

                {note && (
                  <p className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${note.k === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"}`}>
                    {note.k === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {note.m}
                  </p>
                )}

                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Submitting…" : <>Submit report <Flag className="h-4 w-4" /></>}
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
