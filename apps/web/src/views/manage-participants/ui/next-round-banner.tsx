"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useState } from "react";

import { RoundSheet } from "@/features/create-second-round";

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
          <Text typography="subtitle1">대기 {waitingCount}명으로 다음 회차 열기</Text>
          <Text typography="body3" foreground="muted" render={<p />}>
            같은 게임을 새 일정으로 한 번 더 엽니다.
            <br />
            대기 {waitingCount}명이 새 회차의 확정 참여자가 됩니다.
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
