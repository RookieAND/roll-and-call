"use client";

import { Callout, Chip, Field, Grid, VStack } from "@roll-and-call/ui";

import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

import { LockedModeNotice } from "./locked-mode-notice";

const OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

const HINT = {
  [SCHEDULE_MODE.coordinate]: "참여자가 가능 시간을 내면 GM이 겹치는 시간대 중 하나를 확정합니다.",
  [SCHEDULE_MODE.fixed]:
    "정해진 일시로 바로 모집합니다.\n참여자는 가능 시간을 내지 않고, 일정 조율 화면도 생기지 않습니다.",
} as const;

interface ScheduleModeFieldProps {
  value: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
  locked?: boolean;
}

export function ScheduleModeField({ value, onChange, locked = false }: ScheduleModeFieldProps) {
  return (
    <VStack gap="100">
      <Field.Root label="일정 방식">
        <Grid cols={2} gap="100">
          {OPTIONS.map((option) => (
            <Chip
              key={option.value}
              shape="block"
              selected={value === option.value}
              disabled={locked && value !== option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </Grid>
      </Field.Root>
      {locked ? (
        <LockedModeNotice label="일정 방식" />
      ) : (
        <Callout.Root size="sm" className="whitespace-pre-line">
          <Callout.Description>{HINT[value]}</Callout.Description>
        </Callout.Root>
      )}
    </VStack>
  );
}
