import { cn } from "./cn";

const fills = {
  recruiting: "bg-primary-500",
  confirmed: "bg-success-600",
  closed: "bg-gray-400",
} as const;

export type ProgressProps = {
  value: number;
  max?: number;
  color?: keyof typeof fills;
  className?: string;
};

export function Progress({ value, max = 100, color = "recruiting", className }: ProgressProps) {
  const percent = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div className={cn("h-1 w-full overflow-hidden rounded-sm bg-gray-100", className)}>
      <div className={cn("h-full rounded-sm", fills[color])} style={{ width: `${percent}%` }} />
    </div>
  );
}
