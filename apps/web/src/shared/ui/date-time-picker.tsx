"use client";

import { Select } from "@trpg/ui";
import { DatePicker } from "./date-picker";

const pad = (n: number) => String(n).padStart(2, "0");
// 시각은 30분 단위 한 칸("19:00"). 시/분 두 선택을 합쳤다.
const TIME_VALUES = Array.from({ length: 48 }, (_, i) => `${pad(Math.floor(i / 2))}:${i % 2 ? "30" : "00"}`);
const DEFAULT_TIME = "19:00";

export type DateTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  min?: string;
  placeholder?: string;
};

// 날짜 선택 + 30분 단위 시각 선택 → "YYYY-MM-DDTHH:mm"
export function DateTimePicker({ value, onChange, id, invalid, min, placeholder }: DateTimePickerProps) {
  const [datePart = "", timePart = ""] = value ? value.split("T") : [];
  const time = timePart.slice(0, 5) || DEFAULT_TIME;
  // 예전에 30분 단위가 아닌 시각으로 저장된 값도 그대로 고를 수 있게 목록에 끼워 둔다.
  const values = TIME_VALUES.includes(time) ? TIME_VALUES : [time, ...TIME_VALUES];
  const items = values.map((v) => ({ label: v, value: v }));

  const emit = (d: string, t: string) => onChange(d ? `${d}T${t}` : "");

  return (
    <div className="flex gap-2">
      <div className="min-w-0 flex-1">
        <DatePicker
          id={id}
          value={datePart}
          invalid={invalid}
          min={min}
          placeholder={placeholder}
          onChange={(d) => emit(d, time)}
        />
      </div>
      <div className="w-[112px] shrink-0">
        <Select.Root items={items} value={time} onValueChange={(t) => emit(datePart, t)}>
          <Select.Trigger aria-label="시각" />
          <Select.Popup>
            {items.map((o) => (
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
