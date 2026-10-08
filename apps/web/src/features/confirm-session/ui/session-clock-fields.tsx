"use client";

import { Field, HStack, Select } from "@roll-and-call/ui";

import type { TimeRow } from "@/shared/lib";

import { hourOptions, minuteOptions, withClock } from "../model/clock-options";
import type { SessionStart } from "../model/session-start";

interface SessionClockFieldsProps {
  start: SessionStart;
  timeRows?: TimeRow[];
  onChange: (start: SessionStart) => void;
}

export function SessionClockFields({ start, timeRows, onChange }: SessionClockFieldsProps) {
  const hourItems = hourOptions({ timeRows, selectedMinutes: start.minutes });
  const minuteItems = minuteOptions({ selectedMinutes: start.minutes });
  const fields = [
    {
      label: "시",
      items: hourItems,
      value: String(Math.floor(start.minutes / 60)),
      minutesOf: (value: string) => withClock({ minutes: start.minutes, hour: Number(value) }),
    },
    {
      label: "분",
      items: minuteItems,
      value: String(start.minutes % 60),
      minutesOf: (value: string) => withClock({ minutes: start.minutes, minute: Number(value) }),
    },
  ];

  return (
    <HStack gap="100" align="start">
      {fields.map((field) => (
        <Field.Root key={field.label} label={field.label} className="min-w-0 flex-1">
          <Select.Root
            items={field.items}
            value={field.value}
            onValueChange={(value: string) =>
              onChange({ ...start, minutes: field.minutesOf(value) })
            }
          >
            <Select.Trigger aria-label={field.label} />
            <Select.Popup>
              {field.items.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        </Field.Root>
      ))}
    </HStack>
  );
}
