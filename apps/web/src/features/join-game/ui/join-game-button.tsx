"use client";

import { Button, cn } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { TRIAL_HANDLER, useTrialGuard, useTrialHandler } from "@/shared/trial";
import { toast, useAction } from "@/shared/ui";

import { joinGame } from "../api/join-game";
import { joinSuccessMessage } from "../model/join-success-message";
import { OVERLAP_REASON } from "../model/overlap-rejection";
import { OverlapNoticeDialog } from "./overlap-notice-dialog";

interface JoinGameButtonProps {
  gameId: string;
  children: ReactNode;
  className?: string;
}

export function JoinGameButton({ gameId, children, className }: JoinGameButtonProps) {
  const { pending, run } = useAction();
  const join = useTrialHandler(TRIAL_HANDLER.joinGame, joinGame);
  const confirmJoin = useTrialGuard(TRIAL_HANDLER.joinGame);
  const [overlapGameId, setOverlapGameId] = useState<string | null>(null);

  function submit() {
    run(() => join(gameId), {
      onSuccess: (result) => toast.success(joinSuccessMessage(result)),
      // 시간이 겹치면 토스트 대신 안내 창을 띄운다. 그 밖의 실패는 기존대로 토스트다.
      onError: ({ error, reason, overlapGameId: overlapId }) => {
        if (reason === OVERLAP_REASON && overlapId) setOverlapGameId(overlapId);
        else toast.danger(error);
      },
    });
  }

  return (
    <>
      <Button
        size="lg"
        className={cn("w-full", className)}
        loading={pending}
        onClick={() => confirmJoin(submit)}
      >
        {children}
      </Button>
      <OverlapNoticeDialog overlapGameId={overlapGameId} onClose={() => setOverlapGameId(null)} />
    </>
  );
}
