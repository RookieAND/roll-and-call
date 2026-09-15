"use client";

import { Chip, Field, Grid, Text } from "@trpg/ui";

import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

const OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

const HINT = {
  [SCHEDULE_MODE.coordinate]: "참여자가 가능 시간을 내면 GM이 겹치는 시간대 중 하나를 확정합니다.",
  [SCHEDULE_MODE.fixed]:
    "정해진 일시로 바로 모집합니다. 참여자는 가능 시간을 내지 않고, 일정 조율 화면도 생기지 않습니다.",
} as const;

export function ScheduleModeField({
  value,
  onChange,
  lockedReason,
}: {
  value: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
  lockedReason?: string | null;
}) {
  const hint = lockedReason ?? HINT[value];

  return (
    <div className="flex flex-col gap-1.5">
      <Field label="일정 방식">
        <Grid cols={2} gap={2}>
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
      <Text typography="body4" foreground={lockedReason ? "muted" : "hint"} render={<p />}>
        {hint}
      </Text>
    </div>
  );
}
