"use client";

import { Field, HStack, Select } from "@roll-and-call/ui";

import type { FixedSessionDate } from "../model/fixed-session-dates";
import { FIXED_SESSION_TIME_OPTIONS } from "../model/fixed-session-time-options";
import type { SessionStart } from "../model/session-start";

interface FixedSessionTimeFieldsProps {
  dates: FixedSessionDate[];
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function FixedSessionTimeFields({ dates, start, onChange }: FixedSessionTimeFieldsProps) {
  const dateItems = dates.map((day) => ({ value: day.date, label: day.label }));

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
            {dates.map((day) => (
              <Select.Item key={day.date} value={day.date} disabled={day.disabled}>
                {day.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </Field.Root>
      <Field.Root label="시작 시각" className="min-w-0 flex-2">
        <Select.Root
          items={FIXED_SESSION_TIME_OPTIONS}
          value={String(start.minutes)}
          onValueChange={(value: string) => onChange({ ...start, minutes: Number(value) })}
        >
          <Select.Trigger aria-label="시작 시각" />
          <Select.Popup>
            {FIXED_SESSION_TIME_OPTIONS.map((option) => (
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
