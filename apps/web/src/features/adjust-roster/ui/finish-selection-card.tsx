"use client";

import type { SELECTION_REJECTION } from "@roll-and-call/database/games/model";
import { Button, Callout } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, LineBreaks, toast, useAction } from "@/shared/ui";

import { finishSelection } from "../api/finish-selection";
import { finishSelectionLines } from "../model/finish-selection-lines";

interface FinishSelectionCardProps {
  gameId: string;
  confirmedCount: number;
  applicantCount: number;
  isFull: boolean;
  deadlinePassed: boolean;
  minPlayers: number | null;
  block: typeof SELECTION_REJECTION.noConfirmed | typeof SELECTION_REJECTION.minPlayersUnmet | null;
}

// 마감 전후 모두 확인 창을 거친다. 마치면 되돌릴 수 없다.
export function FinishSelectionCard({
  gameId,
  confirmedCount,
  applicantCount,
  isFull,
  deadlinePassed,
  minPlayers,
  block,
}: FinishSelectionCardProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const lines = finishSelectionLines({ applicantCount, isFull, block, minPlayers });
  const leftoverLine =
    applicantCount > 0
      ? `신청한 나머지 ${applicantCount}명은 대기로 옮깁니다.`
      : "남은 신청자는 없습니다.";
  const confirmLines = [
    `확정 ${confirmedCount}명으로 선발을 마칩니다.`,
    leftoverLine,
    ...(deadlinePassed ? [] : ["모집은 바로 닫힙니다."]),
  ];

  function finish() {
    run(() => finishSelection(gameId), {
      onSuccess: () => {
        setConfirming(false);
        toast.success("선발을 마쳤습니다");
      },
      onError: (result) => {
        setConfirming(false);
        toast.danger(result.error);
      },
    });
  }

  return (
    <>
      <Callout.Root colorPalette="primary">
        <Callout.Icon />
        <Callout.Title className="text-subtitle1">세션 참여자 선발하기</Callout.Title>
        <Callout.Description>
          <LineBreaks lines={lines} />
        </Callout.Description>
        <div className="col-span-full mt-150">
          <Button
            size="lg"
            className="w-full"
            disabled={block !== null}
            onClick={() => setConfirming(true)}
          >
            선발 마치기
          </Button>
        </div>
      </Callout.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="선발을 마칠까요?"
        description={<LineBreaks lines={confirmLines} />}
        confirmLabel="선발 마치기"
        danger
        pending={pending}
        onConfirm={finish}
      >
        <Callout.Root colorPalette="danger" size="sm">
          <Callout.Icon />
          <Callout.Description>
            선발을 마친 뒤에는 되돌릴 수 없습니다.
            <br />
            결과는 디스코드 구인 글과 알림 탭으로 바로 알립니다.
          </Callout.Description>
        </Callout.Root>
      </ConfirmDialog>
    </>
  );
}
