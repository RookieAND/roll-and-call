"use client";

import { Field, Select, VStack } from "@roll-and-call/ui";

import type { CoordinationWindow } from "@/entities/game";
import { buildTimeRows, type DayColumn } from "@/shared/lib";

import type { SessionStart } from "../model/session-start";
import { SessionClockFields } from "./session-clock-fields";

interface SessionTimeFieldsProps {
  days: DayColumn[];
  window: CoordinationWindow;
  start: SessionStart;
  onChange: (start: SessionStart) => void;
}

export function SessionTimeFields({ days, window, start, onChange }: SessionTimeFieldsProps) {
  const dateItems = days.map((day) => ({ value: day.date, label: day.label }));

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
            {dateItems.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </Field.Root>
      <SessionClockFields start={start} timeRows={buildTimeRows(window)} onChange={onChange} />
    </VStack>
  );
}
