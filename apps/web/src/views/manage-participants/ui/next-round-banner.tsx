"use client";

import { Button, Callout } from "@roll-and-call/ui";
import { useState } from "react";

import type { ScheduleMode } from "@/entities/game";
import { NextRoundSheet } from "@/features/open-next-round";

interface NextRoundBannerProps {
  game: { id: string; title: string; scheduleMode: ScheduleMode };
  waitingCount: number;
  baseDate: string;
}

export function NextRoundBanner({ game, waitingCount, baseDate }: NextRoundBannerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Callout.Root colorPalette="primary" variant="outline">
        <Callout.Icon />
        <Callout.Title>대기 {waitingCount}명으로 다음 회차 열기</Callout.Title>
        <Callout.Description>
          같은 구인을 새 일정으로 한 번 더 엽니다.
          <br />
          대기 {waitingCount}명이 새 회차의 확정으로 넘어갑니다.
        </Callout.Description>
        <div className="col-span-full mt-150">
          <Button className="w-full" onClick={() => setOpen(true)}>
            다음 회차 만들기
          </Button>
        </div>
      </Callout.Root>
      <NextRoundSheet
        open={open}
        onOpenChange={setOpen}
        game={game}
        waitingCount={waitingCount}
        baseDate={baseDate}
      />
    </>
  );
}
