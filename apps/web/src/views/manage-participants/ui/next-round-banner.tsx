"use client";

import { Button, Callout } from "@roll-and-call/ui";
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
      <Callout.Root colorPalette="primary" variant="outline">
        <Callout.Title>대기 {waitingCount}명으로 다음 회차 열기</Callout.Title>
        <Callout.Description>
          같은 게임을 새 일정으로 한 번 더 엽니다.
          <br />
          대기 {waitingCount}명이 새 회차의 확정으로 넘어갑니다.
        </Callout.Description>
        <div className="col-span-full mt-150">
          <Button className="w-full" onClick={() => setOpen(true)}>
            다음 회차 만들기
          </Button>
        </div>
      </Callout.Root>

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
