"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function PortalPedestal({ className }: { className?: string }) {
  return (
    <div className={cn("relative pointer-events-none select-none", className)} aria-hidden>
      {/* vertical light beam */}
      <motion.div
        initial={{ opacity: 0, scaleY: 0.4 }}
        animate={{ opacity: [0.45, 0.9, 0.45], scaleY: [0.8, 1, 0.8] }}
        transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute left-1/2 -translate-x-1/2 -top-[60%] h-[170%] w-[3px] origin-bottom"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(168,123,255,0) 0%, rgba(168,123,255,0.85) 45%, #C5A6FF 60%, rgba(255,255,255,0.95) 78%, rgba(123,234,255,0.6) 92%, transparent 100%)",
          filter: "blur(0.5px)",
          boxShadow: "0 0 40px rgba(168,123,255,0.8)",
        }}
      />

      {/* concentric rings (top-down ellipses) */}
      <div className="relative h-32 sm:h-40">
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0.2, 0.8, 0.2], scale: [0.95, 1.05, 0.95] }}
            transition={{
              duration: 3.2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
            className="absolute left-1/2 -translate-x-1/2 rounded-[50%] border"
            style={{
              top: `${20 + i * 14}%`,
              width: `${100 - i * 16}%`,
              height: `${18 - i * 2}%`,
              borderColor: "rgba(168,123,255,0.55)",
              boxShadow:
                "0 0 22px rgba(168,123,255,0.45), inset 0 0 14px rgba(168,123,255,0.25)",
            }}
          />
        ))}

        {/* hot center plate */}
        <motion.div
          initial={{ opacity: 0.6 }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-1/2 -translate-x-1/2 bottom-2 h-3 w-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.95) 0%, rgba(168,123,255,0.6) 45%, transparent 100%)",
            filter: "blur(2px)",
          }}
        />

        {/* upward particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: [-10, -120], opacity: [0, 1, 0] }}
            transition={{
              duration: 2.4 + (i % 4) * 0.4,
              repeat: Infinity,
              delay: (i * 0.18) % 2,
              ease: "easeOut",
            }}
            className="absolute bottom-3 h-1 w-1 rounded-full"
            style={{
              left: `${20 + (i * 5.3) % 60}%`,
              background:
                i % 3 === 0
                  ? "#FFFFFF"
                  : i % 3 === 1
                    ? "#C5A6FF"
                    : "#7BEAFF",
              boxShadow: "0 0 8px rgba(168,123,255,0.9)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
