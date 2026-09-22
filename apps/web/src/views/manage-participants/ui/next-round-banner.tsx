"use client";

import { Button, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { RoundSheet } from "@/features/create-second-round";

interface NextRoundBannerProps {
  gameId: string;
  title: string;
  waitingCount: number;
  maxPlayers: number;
  confirmedAt: Date | null;
}

export function NextRoundBanner({
  gameId,
  title,
  waitingCount,
  maxPlayers,
  confirmedAt,
}: NextRoundBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <VStack gap="150" className="rounded-700 border border-tinted-border bg-tinted-bg p-200">
        <VStack gap="050">
          <Text typography="subtitle2">대기 {waitingCount}명으로 다음 회차 열기</Text>
          <Text typography="body3" foreground="muted" render={<p />}>
            같은 게임을 새 일정으로 한 번 더 엽니다.
            <br />
            대기 {waitingCount}명이 새 회차의 확정으로 넘어갑니다.
          </Text>
        </VStack>
        <Button className="h-[46px] w-full rounded-500" onClick={() => setOpen(true)}>
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
