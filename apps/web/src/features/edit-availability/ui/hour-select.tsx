"use client";

import { Select } from "@trpg/ui";

import { formatHour } from "@/entities/profile";

import { HOUR_OPTIONS } from "../model/availability-draft";

export function HourSelect({
  label,
  value,
  min = 0,
  max = 24,
  invalid = false,
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  invalid?: boolean;
  onChange: (hour: number) => void;
}) {
  const items = HOUR_OPTIONS.filter((hour) => hour >= min && hour <= max).map((hour) => ({
    value: String(hour),
    label: formatHour(hour),
  }));

  return (
    <Select.Root
      items={items}
      value={String(value)}
      onValueChange={(hour) => onChange(Number(hour))}
    >
      <Select.Trigger
        aria-label={label}
        invalid={invalid}
        className="h-11 min-w-0 flex-1 tabular-nums"
      />
      <Select.Popup>
        {items.map((item) => (
          <Select.Item key={item.value} value={item.value}>
            {item.label}
          </Select.Item>
        ))}
      </Select.Popup>
    </Select.Root>
  );
}
