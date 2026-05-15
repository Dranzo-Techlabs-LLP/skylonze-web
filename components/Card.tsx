"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = Omit<HTMLMotionProps<"div">, "children"> & {
  variant?: "glass" | "gradient" | "flat";
  interactive?: boolean;
  children?: ReactNode;
};

export function Card({
  className,
  variant = "glass",
  interactive = false,
  children,
  ...props
}: Props) {
  const base =
    variant === "glass"
      ? "glass"
      : variant === "gradient"
        ? "gradient-border"
        : "bg-bg-700/60 border border-violet-400/20";

  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className={cn("relative overflow-hidden rounded-2xl p-5", base, interactive && "cursor-pointer", className)}
      {...props}
    >
      <div className={variant === "gradient" ? "relative z-10" : ""}>{children}</div>
    </motion.div>
  );
}
