"use client";

import { Chip, Field, Text } from "@trpg/ui";
import { SCHEDULE_MODE, type ScheduleMode } from "@/entities/game";

const OPTIONS = [
  { value: SCHEDULE_MODE.coordinate, label: "범위 조율" },
  { value: SCHEDULE_MODE.fixed, label: "일시 지정" },
] as const;

// 두 방식이 무엇을 바꾸는지는 칩만으로 전해지지 않아서 아래에 한 줄로 설명한다.
const HINT = {
  [SCHEDULE_MODE.fixed]: "정해진 일시로 바로 모집합니다. 일정 조율 화면은 생기지 않습니다.",
  [SCHEDULE_MODE.coordinate]:
    "참여자가 가능 시간을 입력하면 GM이 겹치는 시간대 중 하나를 확정합니다.",
} as const;

export function ScheduleModeField({
  value,
  onChange,
}: {
  value: ScheduleMode;
  onChange: (mode: ScheduleMode) => void;
}) {
  return (
    <>
      <Field label="일정 방식">
        <div className="grid grid-cols-2 gap-2">
          {OPTIONS.map((option) => (
            <Chip
              key={option.value}
              shape="block"
              selected={value === option.value}
              onClick={() => onChange(option.value)}
            >
              {option.label}
            </Chip>
          ))}
        </div>
      </Field>
      <Text typography="body4" foreground="muted" className="-mt-2">
        {HINT[value]}
      </Text>
    </>
  );
}
