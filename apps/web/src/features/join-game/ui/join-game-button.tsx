"use client";

import { Button, cn } from "@roll-and-call/ui";
import { isNull } from "es-toolkit";
import { useState, type ReactNode } from "react";

import { RoundScheduleSheet } from "@/entities/game";
import { TRIAL_HANDLER, useTrialGuard, useTrialHandler } from "@/shared/trial";
import { toast, toastActionError, useAction } from "@/shared/ui";

import { checkJoin } from "../api/check-join";
import { joinGame } from "../api/join-game";
import { joinSuccessMessage } from "../model/join-success-message";
import type { MultiRoundApply } from "../model/multi-round-apply";
import { OVERLAP_REASON, type OverlapDetail } from "../model/overlap-rejection";
import { ApplicationNoteSheet } from "./application-note-sheet";
import { ApplySummaryCard } from "./apply-summary-card";
import { OverlapNoticeDialog } from "./overlap-notice-dialog";

type Rejected = { error: string; failed?: true; reason?: string } & Partial<OverlapDetail>;

interface JoinGameButtonProps {
  gameId: string;
  children: ReactNode;
  // 신청글 받기 구인이면 GM의 질문. null이면 신청글 없이 바로 신청한다.
  applicationQuestion?: string | null;
  // 여러 번 진행하는 구인이면 신청글이 없어도 일정 요약 시트를 거친다.
  multiRound?: MultiRoundApply;
  className?: string;
}

export function JoinGameButton({
  gameId,
  children,
  applicationQuestion = null,
  multiRound,
  className,
}: JoinGameButtonProps) {
  const { pending, run } = useAction();
  const join = useTrialHandler(TRIAL_HANDLER.joinGame, joinGame);
  const confirmJoin = useTrialGuard(TRIAL_HANDLER.joinGame);
  const [overlap, setOverlap] = useState<OverlapDetail | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [roundsOpen, setRoundsOpen] = useState(false);
  const [failed, setFailed] = useState(false);

  // 시간이 겹치면 토스트 대신 안내 창을 띄운다. 그 밖의 실패는 기존대로 토스트다.
  function reject(rejected: Rejected) {
    setSheetOpen(false);
    const { reason, overlapGameId, targetRoundCount, overlaps } = rejected;
    if (reason === OVERLAP_REASON && overlapGameId && overlaps) {
      setOverlap({ overlapGameId, targetRoundCount: targetRoundCount ?? 1, overlaps });
    } else toastActionError(rejected);
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

  // 신청글 받기·다회차 구인은 막힘 검사를 먼저 거치고, 통과하면 시트를 연다.
  function start() {
    if (isNull(applicationQuestion) && !multiRound) return submit();
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
        question={applicationQuestion}
        summary={
          multiRound && (
            <ApplySummaryCard
              lines={multiRound.summaryLines}
              onClick={() => {
                setSheetOpen(false);
                setRoundsOpen(true);
              }}
            />
          )
        }
        submitLabel={String(children)}
        pending={pending}
        failed={failed}
        onSubmit={submit}
      />
      {multiRound && (
        <RoundScheduleSheet
          open={roundsOpen}
          onOpenChange={setRoundsOpen}
          summary={multiRound.summaryLines[0] ?? ""}
          rounds={multiRound.rounds}
          onBack={() => {
            setRoundsOpen(false);
            setSheetOpen(true);
          }}
        />
      )}
      <OverlapNoticeDialog overlap={overlap} onClose={() => setOverlap(null)} />
    </>
  );
}
