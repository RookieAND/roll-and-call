"use client";

import { Button, cn } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState, type ReactNode } from "react";

import { TRIAL_HANDLER, useTrialGuard, useTrialHandler } from "@/shared/trial";
import { toast, toastActionError, useAction } from "@/shared/ui";

import { checkJoin } from "../api/check-join";
import { joinGame } from "../api/join-game";
import { joinSuccessMessage } from "../model/join-success-message";
import { OVERLAP_REASON } from "../model/overlap-rejection";
import { ApplicationNoteSheet } from "./application-note-sheet";
import { OverlapNoticeDialog } from "./overlap-notice-dialog";

type Rejected = { error: string; failed?: true; reason?: string; overlapGameId?: string };

interface JoinGameButtonProps {
  gameId: string;
  children: ReactNode;
  // 신청글 받기 구인이면 GM의 질문. null이면 신청글 없이 바로 신청한다.
  applicationQuestion?: string | null;
  className?: string;
}

export function JoinGameButton({
  gameId,
  children,
  applicationQuestion = null,
  className,
}: JoinGameButtonProps) {
  const { pending, run } = useAction();
  const join = useTrialHandler(TRIAL_HANDLER.joinGame, joinGame);
  const confirmJoin = useTrialGuard(TRIAL_HANDLER.joinGame);
  const [overlapGameId, setOverlapGameId] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  // 시간이 겹치면 토스트 대신 안내 창을 띄운다. 그 밖의 실패는 기존대로 토스트다.
  function reject(rejected: Rejected) {
    const { reason, overlapGameId: overlapId } = rejected;
    setSheetOpen(false);
    if (reason === OVERLAP_REASON && overlapId) setOverlapGameId(overlapId);
    else toastActionError(rejected);
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
        toastActionError(result);
      },
    });
  }

  // 신청글 받기 구인은 막힘 검사를 먼저 거치고, 통과하면 글쓰기 시트를 연다.
  function start() {
    if (isNull(applicationQuestion)) return submit();
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
        question={applicationQuestion ?? ""}
        submitLabel={String(children)}
        pending={pending}
        failed={failed}
        onSubmit={submit}
      />
      <OverlapNoticeDialog overlapGameId={overlapGameId} onClose={() => setOverlapGameId(null)} />
    </>
  );
}
