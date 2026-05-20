"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, AtSign, Lock, Mail, Check, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Section } from "@/components/Section";
import { Card } from "@/components/Card";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { Avatar } from "@/components/Avatar";
import { apiGet, apiSend, type Me } from "@/lib/client";

function Note({ kind, msg }: { kind: "ok" | "err"; msg: string }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} role="alert"
      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
        kind === "ok" ? "border-success/40 bg-success/10 text-success" : "border-danger/40 bg-danger/10 text-danger"
      }`}
    >
      {kind === "ok" ? <Check className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />} {msg}
    </motion.p>
  );
}

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [profile, setProfile] = useState({ name: "", handle: "" });
  const [pw, setPw] = useState({ current: "", next: "" });
  const [pNote, setPNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [pwNote, setPwNote] = useState<{ k: "ok" | "err"; m: string } | null>(null);
  const [savingP, setSavingP] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  useEffect(() => {
    apiGet<{ user: Me }>("/api/auth/me").then(({ user }) => {
      setMe(user);
      if (user) setProfile({ name: user.name, handle: user.handle });
    }).catch(() => {});
  }, []);

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setPNote(null); setSavingP(true);
    try {
      const { user } = await apiSend<{ user: Me }>("/api/settings/profile", "PATCH", profile);
      setMe(user);
      setPNote({ k: "ok", m: "Profile updated." });
    } catch (err: any) {
      setPNote({ k: "err", m: err.message });
    } finally { setSavingP(false); }
  }

  async function savePw(e: React.FormEvent) {
    e.preventDefault();
    setPwNote(null); setSavingPw(true);
    try {
      await apiSend("/api/settings/password", "POST", pw);
      setPw({ current: "", next: "" });
      setPwNote({ k: "ok", m: "Password changed." });
    } catch (err: any) {
      setPwNote({ k: "err", m: err.message });
    } finally { setSavingPw(false); }
  }

  return (
    <>
      <PageHeader
        eyebrow="Account settings"
        title={<>Manage your <span className="text-gradient">profile</span>.</>}
        description="Update your identity, handle, and password."
      />
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="h-fit">
            <div className="flex items-center gap-3">
              <Avatar seed={me?.avatar_seed || me?.handle || "you"} size={56} />
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold">{me?.name || "—"}</p>
                <p className="truncate text-xs text-ink-400">@{me?.handle || "—"}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-ink-300"><Mail className="h-4 w-4 text-violet-300" /> {me?.email || "—"}</p>
              <p className="text-xs text-ink-400">Member since {me ? new Date(me.created_at).toLocaleDateString() : "—"}</p>
            </div>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Card>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">Profile</h2>
              <form className="mt-4 space-y-4" onSubmit={saveProfile}>
                <Input label="Full name" required value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  startSlot={<User className="h-4 w-4" />} />
                <Input label="Handle" required value={profile.handle}
                  onChange={(e) => setProfile({ ...profile, handle: e.target.value.replace(/\s+/g, "") })}
                  startSlot={<AtSign className="h-4 w-4" />} hint="3-30 chars: a-z 0-9 . _ -" />
                {pNote && <Note kind={pNote.k} msg={pNote.m} />}
                <Button type="submit" disabled={savingP}>{savingP ? "Saving…" : "Save profile"}</Button>
              </form>
            </Card>

            <Card>
              <h2 className="font-display text-lg font-bold uppercase tracking-wide">Password</h2>
              <form className="mt-4 space-y-4" onSubmit={savePw}>
                <Input label="Current password" type="password" autoComplete="current-password" required
                  value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })}
                  startSlot={<Lock className="h-4 w-4" />} />
                <Input label="New password" type="password" autoComplete="new-password" required minLength={8}
                  value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })}
                  startSlot={<Lock className="h-4 w-4" />} hint="Min 8 chars, letters + numbers" />
                {pwNote && <Note kind={pwNote.k} msg={pwNote.m} />}
                <Button type="submit" disabled={savingPw}>{savingPw ? "Updating…" : "Change password"}</Button>
              </form>
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
