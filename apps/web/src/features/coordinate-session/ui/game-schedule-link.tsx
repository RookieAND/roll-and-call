import { Button, cn } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

// 일정 조율 화면으로 이동하는 CTA. 목록 행·상세 액션 등에서 크기만 바꿔 재사용.
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
