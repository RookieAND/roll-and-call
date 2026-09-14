"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useState } from "react";
import { RoundSheet } from "@/features/create-second-round";
// 대기자가 남았을 때만 뜨는 권유 배너. 실제 생성 폼(시트)까지 이 블록이 들고 있다.
// 넘어가는 사람은 시트와 같은 말("다음 회차의 확정 참여자")로 부른다.
export function NextRoundBanner({
  gameId,
  title,
  waitingCount,
  maxPlayers,
  confirmedAt,
}: {
  gameId: string;
  title: string;
  waitingCount: number;
  maxPlayers: number;
  confirmedAt: Date | null;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VStack gap={3} className="rounded-2xl border border-tinted-border bg-tinted-bg p-4">
        <VStack gap={1}>
          <Text typography="subtitle2">대기 {waitingCount}명으로 다음 회차 열기</Text>
          <Text typography="body3" foreground="muted" render={<p />}>
            같은 게임을 새 일정으로 한 번 더 진행합니다. 대기 {waitingCount}명이 다음 회차의 확정
            참여자로 넘어가고, 이번 회차 명단은 그대로 남습니다.
          </Text>
        </VStack>
        <Button className="h-11 w-full" onClick={() => setOpen(true)}>
          다음 회차 만들기
        </Button>
      </VStack>

      <RoundSheet
        open={open}
        onOpenChange={setOpen}
        gameId={gameId}
        title={title}
        waitingCount={waitingCount}
        maxPlayers={maxPlayers}
        confirmedAt={confirmedAt}
      />
    </>
  );
}
