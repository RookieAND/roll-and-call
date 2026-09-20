"use client";

import { Field, HStack, Select, VStack } from "@trpg/ui";

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

interface SessionTimeFieldsProps {
  days: DayColumn[];
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function SessionTimeFields({ days, start, onChange }: SessionTimeFieldsProps) {
  const dateItems = days.map((day) => ({ value: day.date, label: day.label }));

  return (
    <VStack gap="175" className="p-175">
      <Field label="날짜">
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
      <Field label="시작 시각">
        <HStack gap="100">
          <Select.Root
            items={HOURS}
            value={String(start.hour)}
            onValueChange={(hour: string) => onChange({ ...start, hour: Number(hour) })}
          >
            <Select.Trigger aria-label="시" className="min-w-0 flex-1" />
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
            <Select.Trigger aria-label="분" className="min-w-0 flex-1" />
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
    </VStack>
  );
}
