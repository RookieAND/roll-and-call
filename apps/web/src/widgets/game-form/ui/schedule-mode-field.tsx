"use client";

import { Chip, Field, Grid, VStack } from "@trpg/ui";

import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

import { HintBox } from "./hint-box";

const OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

const HINT = {
  [SCHEDULE_MODE.coordinate]: [
    "참여자가 가능 시간을 내면 GM이 겹치는 시간대 중 하나를 확정합니다.",
  ],
  [SCHEDULE_MODE.fixed]: [
    "정해진 일시로 바로 모집합니다.",
    "참여자는 가능 시간을 내지 않고, 일정 조율 화면도 생기지 않습니다.",
  ],
} as const;

interface ScheduleModeFieldProps {
  value: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
  lockedReason?: string | null;
}

export function ScheduleModeField({ value, onChange, lockedReason }: ScheduleModeFieldProps) {
  const lines = lockedReason ? [lockedReason] : HINT[value];

  return (
    <VStack gap="100">
      <Field label="일정 방식">
        <Grid cols={2} gap="100">
          {OPTIONS.map((option) => (
            <Chip
              key={option.value}
              shape="block"
              selected={value === option.value}
              disabled={Boolean(lockedReason) && value !== option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </Grid>
      </Field>
      <HintBox lines={lines} />
    </VStack>
  );
}
