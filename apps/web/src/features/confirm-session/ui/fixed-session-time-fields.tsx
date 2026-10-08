"use client";

import { Field, Select, VStack } from "@roll-and-call/ui";

import type { FixedSessionDate } from "../model/fixed-session-dates";
import type { SessionStart } from "../model/session-start";
import { SessionClockFields } from "./session-clock-fields";

interface FixedSessionTimeFieldsProps {
  dates: FixedSessionDate[];
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function FixedSessionTimeFields({ dates, start, onChange }: FixedSessionTimeFieldsProps) {
  const dateItems = dates.map((day) => ({ value: day.date, label: day.label }));

  return (
    <VStack gap="100">
      <Field.Root label="날짜">
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
      <SessionClockFields start={start} onChange={onChange} />
    </VStack>
  );
}
