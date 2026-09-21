"use client";

import { Button, Card, Text, VStack, cn } from "@trpg/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

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
  const titleTypography = deadlinePassed ? "subtitle1" : "subtitle2";
  const summaryLine = !deadlinePassed
    ? `신청한 ${poolCount}명 중 ${drawnCount}명이 확정됩니다.`
    : preConfirmedCount > 0
      ? `확정 ${preConfirmedCount}명을 뺀 ${drawCount}자리를 신청 ${poolCount}명 중에서 뽑습니다.`
      : `신청 ${poolCount}명 중 ${drawnCount}명을 뽑습니다.`;
  const closing = deadlinePassed
    ? `나머지 ${leftoverCount}명은 대기로 남고, 뽑은 뒤에도 명단은 고칠 수 있습니다.`
    : `나머지 ${leftoverCount}명은 대기로 남고, 모집은 바로 닫힙니다.`;
  // ponytail: 시안의 확인 시트 대신 공용 ConfirmDialog. 문구는 그대로, 강조색만 없다.
  const confirmDescription = [
    `신청 ${poolCount}명 중 ${drawnCount}명을 무작위로 뽑습니다.`,
    `나머지 ${leftoverCount}명은 대기로 남고, 결과를 함께 받습니다.`,
    "",
    "추첨이 완료되면 모집이 바로 닫히고 다시 돌릴 수 없습니다.",
  ].join("\n");

  function draw() {
    run(() => drawLottery(gameId), {
      onSuccess: () => {
        toast.success(
          `추첨을 마쳤습니다 · 확정 ${preConfirmedCount + drawnCount}명 · 대기 ${leftoverCount}명`,
        );
        setConfirming(false);
      },
    });
  }

  return (
    <>
      {/* 마감 뒤에는 남은 할 일이 이것뿐이라 카드째 강조하고, 마감 전에는 한 블록으로 둔다. */}
      <Card padding="md" className={cn(deadlinePassed && "border-primary-600 bg-tinted-bg")}>
        <VStack gap="150">
          <VStack gap="050">
            <Text typography={titleTypography} weight="extrabold">
              {title}
            </Text>
            <Text typography="body4" foreground="muted" render={<p />}>
              {summaryLine}
              <br />
              {closing}
            </Text>
          </VStack>
          <Button
            variant={deadlinePassed ? "solid" : "tinted"}
            className="h-[46px] w-full rounded-500"
            loading={pending}
            onClick={() => (deadlinePassed ? draw() : setConfirming(true))}
          >
            {deadlinePassed ? "추첨하기" : "지금 추첨하기"}
          </Button>
        </VStack>
      </Card>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title="지금 추첨할까요?"
        description={confirmDescription}
        cancelLabel="마감까지 기다리기"
        confirmLabel="추첨하기"
        pending={pending}
        onConfirm={draw}
      />
    </>
  );
}
