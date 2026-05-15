"use client";
import { motion } from "framer-motion";

export function CitySilhouette({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1200 360"
      preserveAspectRatio="xMidYMax slice"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="city-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1A0F38" stopOpacity="0.0" />
          <stop offset="35%" stopColor="#1A0F38" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#06030F" stopOpacity="0.95" />
        </linearGradient>
        <linearGradient id="city-edge" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="rgba(168,123,255,0.65)" />
          <stop offset="100%" stopColor="rgba(168,123,255,0)" />
        </linearGradient>
      </defs>

      {/* far layer */}
      <g opacity="0.55">
        <path
          d="M0 280 L60 220 L60 260 L120 240 L120 200 L180 220 L180 250 L240 200 L260 240 L320 220 L320 260 L400 200 L420 250 L480 240 L500 210 L560 230 L600 250 L660 220 L720 240 L760 200 L820 230 L880 210 L940 240 L1000 220 L1060 250 L1120 230 L1200 260 L1200 360 L0 360 Z"
          fill="url(#city-fill)"
        />
        <path
          d="M0 280 L60 220 L60 260 L120 240 L120 200 L180 220 L180 250 L240 200 L260 240 L320 220 L320 260 L400 200 L420 250 L480 240 L500 210 L560 230 L600 250 L660 220 L720 240 L760 200 L820 230 L880 210 L940 240 L1000 220 L1060 250 L1120 230 L1200 260"
          stroke="url(#city-edge)"
          strokeWidth="1"
          fill="none"
        />
      </g>

      {/* near layer */}
      <g>
        <path
          d="M0 330 L40 290 L40 280 L80 280 L80 260 L120 260 L120 300 L160 300 L160 220 L180 220 L180 270 L220 270 L220 300 L260 300 L260 240 L300 240 L300 280 L340 280 L340 200 L380 200 L380 290 L420 290 L420 260 L460 260 L460 300 L500 300 L500 240 L540 240 L540 280 L580 280 L580 220 L620 220 L620 290 L660 290 L660 250 L700 250 L700 280 L740 280 L740 230 L780 230 L780 290 L820 290 L820 260 L860 260 L860 210 L900 210 L900 280 L940 280 L940 240 L980 240 L980 300 L1020 300 L1020 260 L1060 260 L1060 230 L1100 230 L1100 300 L1140 300 L1140 270 L1200 270 L1200 360 L0 360 Z"
          fill="url(#city-fill)"
        />
      </g>

      {/* window lights */}
      {Array.from({ length: 80 }).map((_, i) => {
        const x = (i * 53) % 1200;
        const y = 240 + ((i * 17) % 90);
        const delay = (i % 10) * 0.18;
        return (
          <motion.rect
            key={i}
            x={x}
            y={y}
            width={2.2}
            height={2.2}
            fill={i % 3 === 0 ? "#FF7BD5" : i % 3 === 1 ? "#C5A6FF" : "#7BEAFF"}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{ duration: 2.6, repeat: Infinity, delay }}
          />
        );
      })}
    </svg>
  );
}
