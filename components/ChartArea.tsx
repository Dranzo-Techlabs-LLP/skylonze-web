"use client";
import { motion } from "framer-motion";

export function ChartArea({ data, height = 220 }: { data: number[]; height?: number }) {
  if (!data.length) return null;
  const width = 800;
  const max = Math.max(...data) + 5;
  const min = Math.max(0, Math.min(...data) - 5);
  const range = Math.max(1, max - min);
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  const area = `0,${height} ${points} ${width},${height}`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" aria-label="Probability over time">
      <defs>
        <linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#A87BFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#A87BFF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="areaStroke" x1="0" x2="1">
          <stop offset="0" stopColor="#7BEAFF" />
          <stop offset="1" stopColor="#FF7BD5" />
        </linearGradient>
      </defs>
      {/* grid */}
      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1="0"
          x2={width}
          y1={height * p}
          y2={height * p}
          stroke="rgba(168,123,255,0.12)"
          strokeDasharray="3 6"
        />
      ))}
      <motion.polygon
        points={area}
        fill="url(#areaFill)"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke="url(#areaStroke)"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />
      {data.map((v, i) => {
        const cx = i * step;
        const cy = height - ((v - min) / range) * height;
        return (
          <motion.circle
            key={i}
            cx={cx}
            cy={cy}
            r={2.5}
            fill="#06030F"
            stroke="#FF7BD5"
            strokeWidth={1.2}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.06 }}
          />
        );
      })}
    </svg>
  );
}
