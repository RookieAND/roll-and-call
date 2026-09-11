"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useState } from "react";
import { RoundSheet } from "@/features/create-second-round";
// 대기자가 남았을 때만 뜨는 권유 배너. 실제 생성 폼(시트)까지 이 블록이 들고 있다.
export function NextRoundBanner({
  gameId,
  title,
  waitingCount,
  confirmedAt,
}: {
  gameId: string;
  title: string;
  waitingCount: number;
  confirmedAt: Date | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VStack gap={3} className="rounded-2xl border border-primary-100 bg-primary-50/40 p-4">
        <VStack gap={1}>
          <Text typography="subtitle2">대기 {waitingCount}명으로 다음 회차 열기</Text>
          <Text typography="body3" foreground="muted">
            같은 게임을 새 일정으로 한 번 더 진행합니다. 대기자는 자동 초대돼요.
          </Text>
        </VStack>
        <Button className="w-full" onClick={() => setOpen(true)}>
          다음 회차 만들기
        </Button>
      </VStack>

      <RoundSheet
        open={open}
        onOpenChange={setOpen}
        gameId={gameId}
        title={title}
        waitingCount={waitingCount}
        confirmedAt={confirmedAt}
      />
    </>
  );
}
