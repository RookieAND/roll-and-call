"use client";

import { Select } from "@roll-and-call/ui";

interface WindowHourSelectProps {
  id: string;
  label: string;
  items: { value: string; label: string }[];
  value: string;
  disabled: boolean;
  invalid: boolean;
  onChange: (value: string) => void;
}

export function WindowHourSelect({
  id,
  label,
  items,
  value,
  disabled,
  invalid,
  onChange,
}: WindowHourSelectProps) {
  return (
    <Select.Root
      items={items}
      value={value}
      disabled={disabled}
      onValueChange={(next) => onChange(String(next))}
    >
      <Select.Trigger id={id} aria-label={label} invalid={invalid} className="tabular-nums" />
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
