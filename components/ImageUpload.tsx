"use client";
import { useRef, useState } from "react";
import { Upload, X, AlertCircle } from "lucide-react";
import { Button } from "./Button";

type Props = {
  label?: string;
  value?: string | null;
  onChange: (url: string | null) => void;
  size?: number;
  rounded?: "full" | "lg";
};

export function ImageUpload({ label = "Image", value, onChange, size = 80, rounded = "lg" }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", f);
      const r = await fetch("/api/upload", { method: "POST", credentials: "include", body: form });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error || "Upload failed");
      onChange(j.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const r = rounded === "full" ? "rounded-full" : "rounded-xl";
  return (
    <div className="space-y-2">
      {label && <label className="text-[11px] uppercase tracking-wider text-ink-400 block">{label}</label>}
      <div className="flex items-center gap-3">
        <div
          className={`relative inline-flex items-center justify-center overflow-hidden border border-violet-400/30 bg-bg-800 ${r}`}
          style={{ width: size, height: size }}
        >
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <Upload className="h-5 w-5 text-ink-400" />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml" onChange={pick} className="hidden" />
          <Button type="button" size="sm" variant="secondary" disabled={busy} onClick={() => inputRef.current?.click()}>
            {busy ? "Uploading…" : value ? "Replace" : "Upload"}
          </Button>
          {value && (
            <Button type="button" size="sm" variant="outline" className="text-danger border-danger/40" onClick={() => onChange(null)}>
              <X className="h-3.5 w-3.5" /> Remove
            </Button>
          )}
        </div>
      </div>
      {error && (
        <p className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger/10 px-3 py-2 text-xs text-danger">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
}
