import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  tone?: "violet" | "pink" | "cyan" | "success" | "danger" | "warn" | "neutral";
  className?: string;
};

const tones: Record<NonNullable<Props["tone"]>, string> = {
  violet: "bg-violet-500/15 text-violet-300 border-violet-400/30",
  pink: "bg-neon-pink/10 text-neon-pink border-neon-pink/30",
  cyan: "bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30",
  success: "bg-success/10 text-success border-success/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  warn: "bg-warn/10 text-warn border-warn/30",
  neutral: "bg-white/5 text-ink-200 border-ink-200/20",
};

export function Badge({ children, tone = "violet", className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
