"use client";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  hint?: string;
  error?: string;
  startSlot?: React.ReactNode;
};

export const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, hint, error, id, className, startSlot, ...props }, ref) => {
    const inputId = id || `in-${label.replace(/\s+/g, "-").toLowerCase()}`;
    return (
      <div className="space-y-1.5">
        <label htmlFor={inputId} className="text-[11px] uppercase tracking-wider text-ink-400">
          {label}
        </label>
        <div
          className={cn(
            "flex items-center gap-2 rounded-xl border bg-white/5 px-3 transition focus-within:border-violet-400/70",
            error ? "border-danger/60" : "border-violet-400/25",
          )}
        >
          {startSlot && <span className="text-ink-400">{startSlot}</span>}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "h-11 w-full bg-transparent text-sm placeholder:text-ink-400 outline-none",
              className,
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-err` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
        </div>
        {error ? (
          <p id={`${inputId}-err`} role="alert" className="text-[11px] text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-[11px] text-ink-400">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
Input.displayName = "Input";
