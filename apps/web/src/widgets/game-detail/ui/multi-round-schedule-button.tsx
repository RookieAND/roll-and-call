"use client";

import { Button } from "@roll-and-call/ui";
import { useState } from "react";

import { RoundScheduleSheet, type RoundScheduleRound } from "@/entities/game";

interface MultiRoundScheduleButtonProps {
  // 회차 일정 시트 맨 위 요약 줄.
  summary: string;
  rounds: readonly RoundScheduleRound[];
}

// 다회차 구인 정보 표 맨 아래 버튼. 누르면 회차 일정 시트가 열린다.
export function MultiRoundScheduleButton({ summary, rounds }: MultiRoundScheduleButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="tinted"
        colorPalette="gray"
        size="md"
        className="w-full"
        onClick={() => setOpen(true)}
      >
        전체 회차 일정 보기 ›
      </Button>
      <RoundScheduleSheet open={open} onOpenChange={setOpen} summary={summary} rounds={rounds} />
    </>
  );
}
