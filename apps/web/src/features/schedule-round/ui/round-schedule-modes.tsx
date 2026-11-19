"use client";

import { RadioCard, RadioGroup, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import {
  isRoundScheduleMode,
  ROUND_SCHEDULE_MODE,
  type RoundScheduleMode,
} from "../model/round-schedule-mode";
import { useRoundScheduleMode } from "../model/use-round-schedule-mode";

interface RoundScheduleModesProps {
  directLabel: string;
  directDescription: string;
  coordinateLabel: string;
  coordinateDescription: string;
  direct: ReactNode;
  coordinate: ReactNode;
}

const MODES: readonly RoundScheduleMode[] = [
  ROUND_SCHEDULE_MODE.direct,
  ROUND_SCHEDULE_MODE.coordinate,
];

// 두 패널을 모두 그려 두고 숨겨서, 입력하던 값이 모드를 바꿔도 남는다.
export function RoundScheduleModes({
  directLabel,
  directDescription,
  coordinateLabel,
  coordinateDescription,
  direct,
  coordinate,
}: RoundScheduleModesProps) {
  const { mode, setMode } = useRoundScheduleMode();
  const options = {
    [ROUND_SCHEDULE_MODE.direct]: { label: directLabel, description: directDescription },
    [ROUND_SCHEDULE_MODE.coordinate]: {
      label: coordinateLabel,
      description: coordinateDescription,
    },
  };

  return (
    <VStack gap="200">
      <RadioGroup
        value={mode}
        onValueChange={(next) => {
          if (typeof next === "string" && isRoundScheduleMode(next)) setMode(next);
        }}
        aria-label="일정 방식"
        className="grid grid-cols-2 gap-100"
      >
        {MODES.map((value) => (
          <RadioCard.Root key={value} value={value} indicator="radio">
            <RadioCard.Title>{options[value].label}</RadioCard.Title>
            <RadioCard.Description>{options[value].description}</RadioCard.Description>
            <RadioCard.Indicator />
          </RadioCard.Root>
        ))}
      </RadioGroup>
      <div hidden={mode !== ROUND_SCHEDULE_MODE.direct}>{direct}</div>
      <div hidden={mode !== ROUND_SCHEDULE_MODE.coordinate}>{coordinate}</div>
    </VStack>
  );
}
