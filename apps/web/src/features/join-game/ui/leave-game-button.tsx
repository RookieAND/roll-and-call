"use client";

import { Button, cn } from "@trpg/ui";
import { type ReactNode, useTransition } from "react";
import { toast } from "@/shared/ui";
import { leaveGame } from "../api/leave-game";

// 문구는 호출부가 children으로 정한다(대기 취소/참여 취소). 서버 동작은 같다(참여 행 삭제).
export function LeaveGameButton({
  gameId,
  children,
  className,
}: {
  gameId: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function leave() {
    startTransition(async () => {
      const result = await leaveGame(gameId);
      if (result.error) toast.error(result.error);
      else toast.success("신청을 취소했습니다");
    });
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className={cn("w-full", className)}
      loading={pending}
      onClick={leave}
    >
      {children}
    </Button>
  );
}
