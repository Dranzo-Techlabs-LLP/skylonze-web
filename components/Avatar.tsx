import { cn } from "@/lib/utils";

function hashColor(seed: string): { a: string; b: string } {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hues = [
    ["#C5A6FF", "#FF7BD5"],
    ["#7BEAFF", "#A87BFF"],
    ["#FF7BD5", "#7BEAFF"],
    ["#A87BFF", "#34D399"],
    ["#7C3AED", "#FF7BD5"],
    ["#7BEAFF", "#C5FF7B"],
  ];
  const [a, b] = hues[h % hues.length];
  return { a, b };
}

export function Avatar({
  seed,
  size = 40,
  className,
}: {
  seed: string;
  size?: number;
  className?: string;
}) {
  const { a, b } = hashColor(seed);
  const initials = seed.slice(0, 2).toUpperCase();
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white",
        className,
      )}
      style={{
        width: size,
        height: size,
        background: `conic-gradient(from 0deg, ${a}, ${b}, ${a})`,
        boxShadow:
          "inset 0 0 0 1px rgba(255,255,255,0.18), 0 0 12px rgba(168,123,255,0.3)",
      }}
    >
      <span
        className="flex h-[80%] w-[80%] items-center justify-center rounded-full bg-bg-800"
      >
        <span className="text-gradient font-display">{initials}</span>
      </span>
    </span>
  );
}
