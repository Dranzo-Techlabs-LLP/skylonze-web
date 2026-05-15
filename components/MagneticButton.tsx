"use client";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export function MagneticButton({
  children,
  className,
  onClick,
  href,
  strength = 18,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 280, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 280, damping: 18, mass: 0.4 });
  const innerX = useTransform(sx, (v) => v * 0.4);
  const innerY = useTransform(sy, (v) => v * 0.4);

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    const max = Math.max(r.width, r.height);
    const nx = (dx / max) * strength;
    const ny = (dy / max) * strength;
    x.set(nx);
    y.set(ny);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  const Comp: any = href ? motion.a : motion.div;
  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      <Comp
        href={href}
        onClick={onClick}
        style={{ x: innerX, y: innerY }}
        className="block"
      >
        {children}
      </Comp>
    </motion.div>
  );
}
