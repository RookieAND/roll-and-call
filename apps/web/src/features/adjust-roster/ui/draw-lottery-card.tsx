"use client";

import { Button, Card, Text, VStack, cn } from "@trpg/ui";
import { useState } from "react";

import { ConfirmDialog, toast, useAction } from "@/shared/ui";

import { drawLottery } from "../api/draw-lottery";

// 마감 전후로 버튼의 무게가 다르다. 기한이 남았으면 뽑는 순간 모집이 닫히므로 한 번 더 묻는다.
export function DrawLotteryCard({
  gameId,
  applicantCount,
  maxPlayers,
  deadlinePassed,
  daysLeft,
}: {
  gameId: string;
  applicantCount: number;
  maxPlayers: number;
  deadlinePassed: boolean;
  daysLeft: number;
}) {
  const [confirming, setConfirming] = useState(false);
  const { pending, run } = useAction();

  const drawnCount = Math.min(applicantCount, maxPlayers);
  const leftoverCount = applicantCount - drawnCount;
  const title = deadlinePassed
    ? `추첨으로 ${maxPlayers}명 정하기`
    : `지금 추첨으로 ${maxPlayers}명 정하기`;
  const closing = deadlinePassed
    ? "뽑은 뒤에도 명단은 고칠 수 있습니다."
    : "지금 뽑으면 모집이 바로 닫힙니다.";
  // ponytail: 시안의 세 줄 확인 시트 대신 공용 ConfirmDialog. 문구는 그대로, 아이콘만 없다.
  const confirmDescription = [
    `모집이 바로 닫히고, 남은 ${daysLeft}일 동안 새 신청을 받지 않습니다.`,
    `뽑히지 않은 ${leftoverCount}명은 대기 명단에 남고, 결과를 함께 받습니다.`,
    "다시 돌릴 수 없습니다. 이후엔 대기로 이동 · 확정시키기로 바꿉니다.",
  ].join("\n");

  function draw() {
    run(() => drawLottery(gameId), {
      onSuccess: () => {
        toast.success(`추첨을 마쳤습니다 · 확정 ${drawnCount}명 · 대기 ${leftoverCount}명`);
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
            <Text typography="subtitle1">{title}</Text>
            <Text typography="body3" foreground="muted" render={<p />}>
              신청한 {applicantCount}명 중 {drawnCount}명이 확정, 나머지 {leftoverCount}명은 대기로
              남습니다.
              <br />
              {closing}
            </Text>
          </VStack>
          <Button
            variant={deadlinePassed ? "solid" : "tinted"}
            className="h-11 w-full"
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
        description={`지금까지 신청한 ${applicantCount}명 중 ${drawnCount}명을 무작위로 뽑습니다.\n\n${confirmDescription}`}
        cancelLabel="마감까지 기다리기"
        confirmLabel="추첨하기"
        pending={pending}
        onConfirm={draw}
      />
    </>
  );
}
