"use client";

import { Badge, Button, HStack, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { RoundScheduleSheet, type RoundScheduleRound } from "@/entities/game";

interface MultiRoundScheduleButtonProps {
  text: string;
  subLine: string | null;
  sessionBadge: string | null;
  // 회차 일정 시트 맨 위 요약 줄.
  summary: string;
  rounds: readonly RoundScheduleRound[];
}

// 다회차 구인의 일정 줄. 누르면 회차 일정 시트가 열린다.
export function MultiRoundScheduleButton({
  text,
  subLine,
  sessionBadge,
  summary,
  rounds,
}: MultiRoundScheduleButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        colorPalette="gray"
        className="h-auto min-h-11 w-full justify-start whitespace-normal px-0 py-0 text-left hover:bg-transparent"
        onClick={() => setOpen(true)}
      >
        <VStack gap="025" align="start" className="min-w-0">
          <HStack align="center" gap="100" wrap className="min-w-0">
            <Text typography="body3" weight="medium" numeric className="desktop:text-body2">
              {text}
            </Text>
            {sessionBadge && (
              <Badge colorPalette="primary" className="tabular-nums">
                {sessionBadge}
              </Badge>
            )}
          </HStack>
          {subLine && (
            <Text typography="body4" foreground="hint">
              {subLine}
            </Text>
          )}
        </VStack>
      </Button>
      <RoundScheduleSheet open={open} onOpenChange={setOpen} summary={summary} rounds={rounds} />
    </>
  );
}
