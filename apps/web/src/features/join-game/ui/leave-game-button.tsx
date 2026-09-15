"use client";

import { Button, cn } from "@trpg/ui";
import type { ReactNode } from "react";

import { toast, useAction } from "@/shared/ui";

import { leaveGame } from "../api/leave-game";

export function LeaveGameButton({
  gameId,
  children,
  className,
}: {
  gameId: string;
  children: ReactNode;
  className?: string;
}) {
  const { pending, run } = useAction();

  function leave() {
    run(() => leaveGame(gameId), {
      onSuccess: () => toast.success("신청을 취소했습니다"),
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
