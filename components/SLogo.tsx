import { cn } from "@/lib/utils";

type Props = {
  size?: number;
  className?: string;
  ariaLabel?: string;
};

export function SLogo({ size = 40, className, ariaLabel = "SKYLONZE" }: Props) {
  return (
    <img
      src="/skylonze-logo.png"
      alt={ariaLabel}
      width={size}
      height={size}
      className={cn("shrink-0 select-none object-contain", className)}
      style={{ width: size, height: size }}
      draggable={false}
    />
  );
}
