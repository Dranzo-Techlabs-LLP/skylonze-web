"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  right,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative pt-12 md:pt-20 pb-6 md:pb-10", className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[400px] w-[900px] -translate-x-1/2 rounded-full bg-violet-500/15 blur-3xl" aria-hidden />
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div>
          {eyebrow && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300"
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-2 font-display text-3xl md:text-5xl font-bold leading-tight tracking-tight"
          >
            {title}
          </motion.h1>
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-3 max-w-2xl text-ink-200/90"
            >
              {description}
            </motion.p>
          )}
        </div>
        {right && <div className="shrink-0">{right}</div>}
      </div>
    </div>
  );
}
