"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { useState } from "react";

import { ConfirmDialog, useAction } from "@/shared/ui";

import { drawLottery } from "../api/draw-lottery";

interface DrawLotteryCardProps {
  gameId: string;
  applicantCount: number;
  preConfirmedCount: number;
  drawCount: number;
  deadlinePassed: boolean;
}

// 마감 전후로 버튼의 무게가 다르다. 기한이 남았으면 뽑는 순간 모집이 닫히므로 한 번 더 묻는다.
// applicantCount는 직접 확정한 사람을 뺀 추첨 대상 수다. 직접 확정은 뽑을 자리에서만 뺀다.
export function DrawLotteryCard({
  gameId,
  applicantCount,
  preConfirmedCount,
  drawCount,
  deadlinePassed,
}: DrawLotteryCardProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const poolCount = applicantCount;
  const drawnCount = Math.min(poolCount, drawCount);
  const leftoverCount = poolCount - drawnCount;
  const title = deadlinePassed
    ? `추첨으로 ${drawCount}명 정하기`
    : `지금 추첨으로 ${drawCount}명 정하기`;
  const summaryLine = !deadlinePassed
    ? `신청한 ${poolCount}명 중 ${drawnCount}명이 확정됩니다.`
    : preConfirmedCount > 0
      ? `확정 ${preConfirmedCount}명을 뺀 ${drawCount}자리를 신청 ${poolCount}명 중에서 뽑습니다.`
      : `신청 ${poolCount}명 중 ${drawnCount}명을 뽑습니다.`;
  const closing = deadlinePassed
    ? `나머지 ${leftoverCount}명은 대기로 남고, 뽑은 뒤에도 명단은 고칠 수 있습니다.`
    : `나머지 ${leftoverCount}명은 대기로 남고, 모집은 바로 닫힙니다.`;
  function draw() {
    run(() => drawLottery(gameId), {
      onSuccess: () => setConfirming(false),
    });
  }

  return (
    <>
      <Callout.Root colorPalette="primary">
        <Callout.Title className="text-subtitle1">{title}</Callout.Title>
        <Callout.Description>
          {summaryLine}
          <br />
          {closing}
        </Callout.Description>
        <div className="col-span-full mt-150">
          <Button
            size="lg"
            className="w-full"
            loading={pending}
            onClick={() => (deadlinePassed ? draw() : setConfirming(true))}
          >
            {deadlinePassed ? "추첨하기" : "지금 추첨하기"}
          </Button>
        </div>
      </Callout.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="지금 추첨할까요?"
        description={
          <>
            신청 {poolCount}명 중 {drawnCount}명을 무작위로 뽑습니다.
            <br />
            나머지 {leftoverCount}명은 대기로 남고, 결과를 함께 받습니다.
          </>
        }
        cancelLabel="마감까지 기다리기"
        confirmLabel="추첨하기"
        pending={pending}
        onConfirm={draw}
      >
        <Callout.Root colorPalette="danger" size="sm">
          <Callout.Icon />
          <Callout.Description>
            추첨이 완료되면 모집이 바로 닫히고 다시 돌릴 수 없습니다.
          </Callout.Description>
        </Callout.Root>
      </ConfirmDialog>
    </>
  );
}
