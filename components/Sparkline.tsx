"use client";
import { motion } from "framer-motion";

type Props = {
  data: number[];
  width?: number;
  height?: number;
  stroke?: string;
  fill?: string;
  className?: string;
};

export function Sparkline({
  data,
  width = 120,
  height = 36,
  stroke = "url(#sparkStroke)",
  fill = "url(#sparkFill)",
  className,
}: Props) {
  if (data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const step = width / (data.length - 1);
  const points = data
    .map((v, i) => `${i * step},${height - ((v - min) / range) * height}`)
    .join(" ");
  const area = `0,${height} ${points} ${width},${height}`;
  const last = data[data.length - 1] ?? 0;
  const first = data[0] ?? 0;
  const up = last >= first;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden>
      <defs>
        <linearGradient id="sparkStroke" x1="0" x2="1">
          <stop offset="0" stopColor={up ? "#7BEAFF" : "#FF7BD5"} />
          <stop offset="1" stopColor={up ? "#C5A6FF" : "#FF7BD5"} />
        </linearGradient>
        <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={up ? "#A87BFF" : "#FF7BD5"} stopOpacity="0.35" />
          <stop offset="1" stopColor={up ? "#A87BFF" : "#FF7BD5"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.polygon
        points={area}
        fill={fill}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      />
      <motion.polyline
        points={points}
        fill="none"
        stroke={stroke}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
      />
    </svg>
  );
}
