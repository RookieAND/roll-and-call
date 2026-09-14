"use client";

import { Button, cn } from "@trpg/ui";
import { type ReactNode, useTransition } from "react";
import { toast } from "@/shared/ui";
import { joinGame } from "../api/join-game";

// 문구는 호출부가 children으로 정한다(참여/대기 신청). 토스트는 서버의 실제 결과를 따른다.
export function JoinGameButton({
  gameId,
  children,
  className,
}: {
  gameId: string;
  children: ReactNode;
  className?: string;
}) {
  const [pending, startTransition] = useTransition();

  function join() {
    startTransition(async () => {
      const result = await joinGame(gameId);
      if (result.error) toast.error(result.error);
      else toast.success(result.waiting ? "대기로 접수했습니다" : "참여했습니다");
    });
  }

  return (
    <Button size="lg" className={cn("w-full", className)} loading={pending} onClick={join}>
      {children}
    </Button>
  );
}
