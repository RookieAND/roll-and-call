"use client";

import { SegmentedControl, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { isRoundScheduleMode, ROUND_SCHEDULE_MODE } from "../model/round-schedule-mode";
import { useRoundScheduleMode } from "../model/use-round-schedule-mode";

interface RoundScheduleModesProps {
  directLabel: string;
  coordinateLabel: string;
  direct: ReactNode;
  coordinate: ReactNode;
}

// 두 패널을 모두 그려 두고 숨겨서, 입력하던 값이 모드를 바꿔도 남는다.
export function RoundScheduleModes({
  directLabel,
  coordinateLabel,
  direct,
  coordinate,
}: RoundScheduleModesProps) {
  const { mode, setMode } = useRoundScheduleMode();

  return (
    <VStack gap="200">
      <SegmentedControl.Root
        value={mode}
        onValueChange={(next) => {
          if (isRoundScheduleMode(next)) setMode(next);
        }}
        aria-label="일정 방식"
      >
        <SegmentedControl.Item value={ROUND_SCHEDULE_MODE.direct}>
          {directLabel}
        </SegmentedControl.Item>
        <SegmentedControl.Item value={ROUND_SCHEDULE_MODE.coordinate}>
          {coordinateLabel}
        </SegmentedControl.Item>
      </SegmentedControl.Root>
      <div hidden={mode !== ROUND_SCHEDULE_MODE.direct}>{direct}</div>
      <div hidden={mode !== ROUND_SCHEDULE_MODE.coordinate}>{coordinate}</div>
    </VStack>
  );
}
