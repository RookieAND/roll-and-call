"use client";

import { Field, HStack, Select } from "@roll-and-call/ui";

import type { CoordinationWindow } from "@/entities/game";
import { buildTimeRows, type DayColumn } from "@/shared/lib";

import type { SessionStart } from "../model/session-start";
import { sessionTimeOptions } from "../model/session-time-options";

interface SessionTimeFieldsProps {
  days: DayColumn[];
  window: CoordinationWindow;
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function SessionTimeFields({ days, window, start, onChange }: SessionTimeFieldsProps) {
  const dateItems = days.map((day) => ({ value: day.date, label: day.label }));
  const timeItems = sessionTimeOptions({
    timeRows: buildTimeRows(window),
    selectedMinutes: start.minutes,
  });

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
          items={timeItems}
          value={String(start.minutes)}
          onValueChange={(value: string) => onChange({ ...start, minutes: Number(value) })}
        >
          <Select.Trigger aria-label="시작 시각" />
          <Select.Popup>
            {timeItems.map((option) => (
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
