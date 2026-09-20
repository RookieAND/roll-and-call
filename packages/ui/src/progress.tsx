import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "./cn";

const fill = cva("h-full rounded-100", {
  variants: {
    color: {
      recruiting: "bg-primary-500",
      waiting: "bg-primary-300",
      confirmed: "bg-success-600",
      closed: "bg-gray-400",
    },
  },
  defaultVariants: { color: "recruiting" },
});

export interface ProgressProps extends VariantProps<typeof fill> {
  value: number;
  max?: number;
  className?: string;
}

export function Progress({ value, max = 100, color, className }: ProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-100 bg-gray-100", className)}>
      <div className={fill({ color })} style={{ width: `${percent}%` }} />
    </div>
  );
}
