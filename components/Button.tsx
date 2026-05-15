"use client";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
  glow?: boolean;
};

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-violet-600 via-violet-500 to-neon-pink text-white shadow-glow hover:shadow-glow-lg",
  secondary:
    "bg-white/5 text-ink-50 border border-violet-400/30 hover:border-violet-400/60",
  ghost: "bg-transparent text-ink-200 hover:text-white hover:bg-white/5",
  outline:
    "bg-transparent text-ink-50 border border-ink-200/30 hover:border-ink-200/60",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-sm rounded-lg",
  md: "h-11 px-5 text-sm rounded-xl",
  lg: "h-13 px-7 text-base rounded-2xl",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", glow = true, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        whileHover={{ y: -1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 font-medium tracking-tight transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-50",
          variants[variant],
          sizes[size],
          glow && variant === "primary" && "hover:animate-glow-breathe",
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    );
  },
);
Button.displayName = "Button";
