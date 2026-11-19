"use client";

import { Select } from "@roll-and-call/ui";

interface RoundWindowHourSelectProps {
  id: string;
  label: string;
  items: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export function RoundWindowHourSelect({
  id,
  label,
  items,
  value,
  onChange,
}: RoundWindowHourSelectProps) {
  return (
    <Select.Root items={items} value={value} onValueChange={(next) => onChange(String(next))}>
      <Select.Trigger id={id} aria-label={label} className="tabular-nums" />
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
