"use client";

import { Button, cn } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { TRIAL_HANDLER, useTrialGuard, useTrialHandler } from "@/shared/trial";
import { toast, useAction } from "@/shared/ui";

import { checkJoin } from "../api/check-join";
import { joinGame } from "../api/join-game";
import { joinSuccessMessage } from "../model/join-success-message";
import { OVERLAP_REASON } from "../model/overlap-rejection";
import { ApplicationNoteSheet } from "./application-note-sheet";
import { OverlapNoticeDialog } from "./overlap-notice-dialog";

type Rejected = { error: string; reason?: string; overlapGameId?: string };

interface JoinGameButtonProps {
  gameId: string;
  children: ReactNode;
  applicationNote?: boolean;
  className?: string;
}

export function JoinGameButton({
  gameId,
  children,
  applicationNote = false,
  className,
}: JoinGameButtonProps) {
  const { pending, run } = useAction();
  const join = useTrialHandler(TRIAL_HANDLER.joinGame, joinGame);
  const confirmJoin = useTrialGuard(TRIAL_HANDLER.joinGame);
  const [overlapGameId, setOverlapGameId] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  // 시간이 겹치면 토스트 대신 안내 창을 띄운다. 그 밖의 실패는 기존대로 토스트다.
  function reject({ error, reason, overlapGameId: overlapId }: Rejected) {
    setSheetOpen(false);
    if (reason === OVERLAP_REASON && overlapId) setOverlapGameId(overlapId);
    else toast.danger(error);
  }

  function submit(note?: string) {
    setFailed(false);
    run(() => join(gameId, note), {
      onSuccess: (result) => {
        setSheetOpen(false);
        toast.success(joinSuccessMessage(result));
      },
      onError: (result) => {
        if (!sheetOpen || result.reason === OVERLAP_REASON) return reject(result);
        setFailed(true);
        toast.danger(result.error);
      },
    });
  }

  // 신청글 받기 구인은 막힘 검사를 먼저 거치고, 통과하면 글쓰기 시트를 연다.
  function start() {
    if (!applicationNote) return submit();
    run(() => checkJoin(gameId), { onSuccess: () => setSheetOpen(true), onError: reject });
  }

  return (
    <>
      <Button
        size="lg"
        className={cn("w-full", className)}
        loading={pending}
        onClick={() => confirmJoin(start)}
      >
        {children}
      </Button>
      <ApplicationNoteSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        submitLabel={String(children)}
        pending={pending}
        failed={failed}
        onSubmit={submit}
      />
      <OverlapNoticeDialog overlapGameId={overlapGameId} onClose={() => setOverlapGameId(null)} />
    </>
  );
}
