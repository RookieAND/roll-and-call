import { Button, cn } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function GameScheduleLink({
  gameId,
  label = "일정 조율하기",
  className,
}: {
  gameId: string;
  label?: string;
  className?: string;
}) {
  return (
    <Button asChild variant="tinted" className={cn("gap-1.5 font-bold", className)}>
      <Link href={`/games/${gameId}/schedule`}>
        {label} <ChevronRight size={16} aria-hidden />
      </Link>
    </Button>
  );
}
