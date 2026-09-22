"use client";

import { Button, cn } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { toast, useAction } from "@/shared/ui";

import { joinGame } from "../api/join-game";

interface JoinGameButtonProps {
  gameId: string;
  children: ReactNode;
  className?: string;
}

export function JoinGameButton({ gameId, children, className }: JoinGameButtonProps) {
  const { pending, run } = useAction();

  function join() {
    run(() => joinGame(gameId), {
      onSuccess: (result) => toast.success(result.waiting ? "대기로 접수했습니다" : "참여했습니다"),
    });
  }

  return (
    <Button size="lg" className={cn("w-full", className)} loading={pending} onClick={join}>
      {children}
    </Button>
  );
}
