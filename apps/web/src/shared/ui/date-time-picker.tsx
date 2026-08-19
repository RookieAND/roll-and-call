"use client";

import { Select } from "@trpg/ui";
import { DatePicker } from "./date-picker";

const pad = (n: number) => String(n).padStart(2, "0");
const hourOptions = Array.from({ length: 24 }, (_, h) => ({
  label: `${pad(h)}시`,
  value: pad(h),
}));
const minuteOptions = Array.from({ length: 60 }, (_, m) => ({
  label: `${pad(m)}분`,
  value: pad(m),
}));

export type DateTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  min?: string;
};

// combines a custom date picker with hour/minute selects → "YYYY-MM-DDTHH:mm"
export function DateTimePicker({ value, onChange, id, invalid, min }: DateTimePickerProps) {
  const parts = value ? value.split("T") : [];
  const datePart = parts[0] ?? "";
  const timeParts = (parts[1] ?? "").split(":");
  const hh = timeParts[0] || "19";
  const mm = timeParts[1] || "00";

  const emit = (d: string, h: string, m: string) => onChange(d ? `${d}T${h}:${m}` : "");

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        id={id}
        value={datePart}
        invalid={invalid}
        min={min}
        onChange={(d) => emit(d, hh, mm)}
      />
      <div className="flex gap-2">
        <Select.Root items={hourOptions} value={hh} onValueChange={(v) => emit(datePart, v, mm)}>
          <Select.Trigger />
          <Select.Popup>
            {hourOptions.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
        <Select.Root items={minuteOptions} value={mm} onValueChange={(v) => emit(datePart, hh, v)}>
          <Select.Trigger />
          <Select.Popup>
            {minuteOptions.map((o) => (
              <Select.Item key={o.value} value={o.value}>
                {o.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </div>
    </div>
  );
}
