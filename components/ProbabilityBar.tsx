"use client";
import { motion } from "framer-motion";

export function ProbabilityBar({ yes }: { yes: number }) {
  const no = 100 - yes;
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5 text-xs">
        <span className="text-success font-medium tabular">YES {yes}%</span>
        <span className="text-danger font-medium tabular">NO {no}%</span>
      </div>
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-bg-700">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${yes}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background:
              "linear-gradient(90deg,#34D399 0%, #7BEAFF 60%, #A87BFF 100%)",
            boxShadow: "0 0 14px rgba(123,234,255,0.5)",
          }}
        />
      </div>
    </div>
  );
}
