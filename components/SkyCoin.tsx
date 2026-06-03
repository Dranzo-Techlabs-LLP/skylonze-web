"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  spin?: boolean;
  /** Kept for API compatibility. */
  detailed?: boolean;
};

/**
 * A single SKY-3030 coin: the brand monogram set into a circular medallion
 * with a metallic violet rim. (Replaces the previous multi-coin photo.)
 */
export function SkyCoin({ size = 28, className, spin = false }: Props) {
  const rim = Math.max(1, Math.round(size * 0.08));
  return (
    <motion.span
      aria-hidden
      className={cn("relative inline-block shrink-0 rounded-full align-middle", className)}
      style={{
        width: size,
        height: size,
        padding: rim,
        background: "conic-gradient(from 210deg, #E9DBFF, #A87BFF, #7C3AED, #3B1A86, #A87BFF, #E9DBFF)",
        boxShadow:
          size >= 80
            ? "0 12px 32px rgba(124,58,237,0.55), 0 0 18px rgba(168,123,255,0.45)"
            : "0 2px 6px rgba(124,58,237,0.5)",
      }}
      animate={spin ? { y: [0, -3, 0] } : undefined}
      transition={spin ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/skylonze-logo.png"
        alt=""
        aria-hidden
        draggable={false}
        className="block h-full w-full select-none rounded-full object-cover"
      />
      {/* inner bevel + glossy highlight */}
      <span className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-inset ring-white/25" />
      <span
        className="pointer-events-none absolute rounded-full"
        style={{
          inset: rim,
          background: "radial-gradient(120% 90% at 30% 22%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)",
        }}
      />
    </motion.span>
  );
}
