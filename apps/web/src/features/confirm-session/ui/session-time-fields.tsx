"use client";

import { Field, HStack, Select } from "@trpg/ui";

import { DAY_END_HOUR, DAY_START_HOUR, type DayColumn } from "@/shared/lib";

import type { SessionStart } from "../model/session-start";

const HOURS = Array.from({ length: DAY_END_HOUR - DAY_START_HOUR }, (_, index) => {
  const hour = DAY_START_HOUR + index;
  return { value: String(hour), label: `${hour}시` };
});
const MINUTES = [
  { value: "0", label: "00분" },
  { value: "30", label: "30분" },
];

export function SessionTimeFields({
  days,
  start,
  onChange,
}: {
  days: DayColumn[];
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}) {
  const dateItems = days.map((day) => ({ value: day.date, label: day.label }));

  return (
    <HStack gap="100">
      <Field label="날짜" className="min-w-0 flex-1">
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
      </Field>
      <Field label="시작 시각" className="w-[152px] shrink-0">
        <HStack gap="100">
          <Select.Root
            items={HOURS}
            value={String(start.hour)}
            onValueChange={(hour: string) => onChange({ ...start, hour: Number(hour) })}
          >
            <Select.Trigger aria-label="시" />
            <Select.Popup>
              {HOURS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
          <Select.Root
            items={MINUTES}
            value={String(start.minute)}
            onValueChange={(minute: string) => onChange({ ...start, minute: Number(minute) })}
          >
            <Select.Trigger aria-label="분" />
            <Select.Popup>
              {MINUTES.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        </HStack>
      </Field>
    </HStack>
  );
}
