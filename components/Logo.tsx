import { cn } from "@/lib/utils";
import { SLogo } from "./SLogo";

export function Logo({ className, size = 32 }: { className?: string; size?: number }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <SLogo size={size} />
      <span className="font-display text-lg font-bold tracking-[0.08em] uppercase">
        <span className="text-white">Skyl</span>
        <span className="text-gradient">onze</span>
      </span>
    </div>
  );
}
