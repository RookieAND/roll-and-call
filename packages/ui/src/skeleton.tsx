import { cn } from "./cn";

export type SkeletonProps = { className?: string };

// size it via className, e.g. <Skeleton className="h-4 w-32" />
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-[shimmer_1.3s_ease-in-out_infinite] rounded-md bg-gray-100",
        className,
      )}
    />
  );
}
