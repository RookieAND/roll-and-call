import { cn } from "./cn";

export type SkeletonProps = { className?: string };

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-[shimmer_1.3s_ease-in-out_infinite] rounded-200 bg-gray-100",
        className,
      )}
    />
  );
}
