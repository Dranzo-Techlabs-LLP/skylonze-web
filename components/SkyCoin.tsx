"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  spin?: boolean;
  /** Kept for API compatibility — coin.png already includes engraved ring. */
  detailed?: boolean;
};

export function SkyCoin({ size = 28, className, spin = false }: Props) {
  return (
    <motion.span
      aria-hidden
      className={cn("relative inline-block align-middle", className)}
      style={{ width: size, height: size }}
      animate={spin ? { y: [0, -3, 0] } : undefined}
      transition={spin ? { duration: 3.6, repeat: Infinity, ease: "easeInOut" } : undefined}
    >
      <img
        src="/coin.png"
        alt=""
        aria-hidden
        draggable={false}
        className="block h-full w-full select-none object-contain"
        style={{
          filter: size >= 80
            ? "drop-shadow(0 12px 32px rgba(124,58,237,0.55)) drop-shadow(0 0 18px rgba(168,123,255,0.45))"
            : "drop-shadow(0 2px 6px rgba(124,58,237,0.5))",
        }}
      />
    </motion.span>
  );
}
