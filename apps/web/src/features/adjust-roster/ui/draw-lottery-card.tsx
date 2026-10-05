"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useServerPath } from "@/shared/lib";
import { ConfirmDialog, LineBreaks, toast, useAction } from "@/shared/ui";

import { drawLottery } from "../api/draw-lottery";

interface DrawLotteryCardProps {
  gameId: string;
  applicantCount: number;
  drawCount: number;
  deadlinePassed: boolean;
}

// applicantCount는 직접 확정한 사람을 뺀 추첨 대상 수다. 직접 확정은 뽑을 자리에서만 뺀다.
// 마감 전후 모두 확인 창을 거쳐 굴린다.
export function DrawLotteryCard({
  gameId,
  applicantCount,
  drawCount,
  deadlinePassed,
}: DrawLotteryCardProps) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();
  const router = useRouter();
  const toServerPath = useServerPath();

  const drawnCount = Math.min(applicantCount, drawCount);
  const leftoverCount = applicantCount - drawnCount;
  const skipsDraw = applicantCount <= drawCount;
  const title = deadlinePassed
    ? `추첨으로 ${drawCount}명 정하기`
    : `지금 추첨으로 ${drawCount}명 정하기`;
  const lines = [
    `신청한 ${applicantCount}명 중 ${drawnCount}명이 확정됩니다.`,
    `나머지 ${leftoverCount}명은 대기로 남고, 모집은 바로 닫힙니다.`,
  ];
  if (skipsDraw) lines.splice(0, lines.length, `신청한 ${applicantCount}명이 모두 확정됩니다.`);
  if (deadlinePassed && !skipsDraw) {
    lines.splice(0, lines.length, "기다리지 않고 지금 추첨할 수도 있습니다.");
  }

  function draw() {
    run(() => drawLottery(gameId), {
      onSuccess: () => setConfirming(false),
      onError: (result) => {
        toast.error(result.error);
        if (!result.alreadyDrawn) return;
        setConfirming(false);
        router.push(toServerPath(`/games/${gameId}/draw`));
      },
    });
  }

  return (
    <>
      <Callout.Root colorPalette="primary">
        <Callout.Icon />
        <Callout.Title className="text-subtitle1">{title}</Callout.Title>
        <Callout.Description>
          <LineBreaks lines={lines} />
        </Callout.Description>
        <div className="col-span-full mt-150">
          <Button size="lg" className="w-full" onClick={() => setConfirming(true)}>
            지금 추첨하기
          </Button>
        </div>
      </Callout.Root>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={skipsDraw ? "지금 확정할까요?" : "지금 추첨할까요?"}
        description={
          skipsDraw ? (
            <>
              신청한 <b className="text-fg-normal">{applicantCount}명</b>이 모두 확정됩니다.
              <br />
              확정되면 되돌릴 수 없습니다.
            </>
          ) : (
            <>
              신청 {applicantCount}명 중 {drawnCount}명을 무작위로 뽑습니다.
              <br />
              나머지 {leftoverCount}명은 대기로 남습니다.
            </>
          )
        }
        cancelLabel={skipsDraw || deadlinePassed ? "취소" : "마감까지 기다리기"}
        confirmLabel={skipsDraw ? "지금 확정하기" : "추첨하기"}
        pending={pending}
        onConfirm={draw}
      >
        {!skipsDraw && (
          <Callout.Root colorPalette="danger" size="sm">
            <Callout.Icon />
            <Callout.Description>
              추첨 뒤에는 되돌릴 수 없습니다.
              <br />
              결과는 디스코드 구인 글과 알림 탭으로 바로 알립니다.
            </Callout.Description>
          </Callout.Root>
        )}
      </ConfirmDialog>
    </>
  );
}
