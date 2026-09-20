import { Button, cn, type ButtonProps } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

export function GameScheduleLink({
  gameId,
  label = "일정 조율하기",
  variant = "tinted",
  className,
}: {
  gameId: string;
  label?: string;
  variant?: ButtonProps["variant"];
  className?: string;
}) {
  return (
    <Button asChild variant={variant} className={cn("gap-075 font-bold", className)}>
      <Link href={`/games/${gameId}/schedule`}>
        {label} <ChevronRight size={16} aria-hidden />
      </Link>
    </Button>
  );
}
