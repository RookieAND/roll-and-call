"use client";

import { Field, HStack, Select } from "@roll-and-call/ui";

import { DAY_END_HOUR, DAY_START_HOUR, type DayColumn } from "@/shared/lib";

import type { SessionStart } from "../model/session-start";

// 30분 단위 "HH:MM". 값은 hour*60+minute 문자열로 들고 다닌다.
const TIMES = Array.from({ length: (DAY_END_HOUR - DAY_START_HOUR) * 2 }, (_, index) => {
  const minutes = DAY_START_HOUR * 60 + index * 30;
  const label = `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
  return { value: String(minutes), label };
});

interface SessionTimeFieldsProps {
  days: DayColumn[];
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function SessionTimeFields({ days, start, onChange }: SessionTimeFieldsProps) {
  const dateItems = days.map((day) => ({ value: day.date, label: day.label }));
  const timeValue = String(start.hour * 60 + start.minute);

  return (
    <HStack gap="100" align="start">
      <Field.Root label="날짜" className="min-w-0 flex-3">
        <Select.Root
          items={dateItems}
          value={start.date}
          onValueChange={(date: string) => onChange({ ...start, date })}
        >
          <Select.Trigger aria-label="날짜" />
          <Select.Popup>
            {dateItems.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </Field.Root>
      <Field.Root label="시작 시각" className="min-w-0 flex-2">
        <Select.Root
          items={TIMES}
          value={timeValue}
          onValueChange={(value: string) =>
            onChange({ ...start, hour: Math.floor(Number(value) / 60), minute: Number(value) % 60 })
          }
        >
          <Select.Trigger aria-label="시작 시각" />
          <Select.Popup>
            {TIMES.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </Field.Root>
    </HStack>
  );
}
