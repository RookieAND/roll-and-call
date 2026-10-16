import { cn } from "@roll-and-call/ui";

interface PodiumRankMarkProps {
  rank: number;
  className?: string;
  shine?: boolean;
}

export function PodiumRankMark({ rank, className, shine }: PodiumRankMarkProps) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute left-1/2 overflow-hidden z-10 flex -translate-x-1/2 items-center justify-center rounded-full border-[3px] border-white text-body3 font-extrabold text-white tabular-nums shadow-md",
        className,
      )}
    >
      {rank}
      {shine && <span aria-hidden className="animate-badge-shine absolute inset-0 rounded-full" />}
    </span>
  );
}
