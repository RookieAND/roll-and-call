"use client";

import { Select } from "@trpg/ui";

import { padTwoDigits } from "@/shared/lib";

import { DatePicker } from "./date-picker";

const TIME_VALUES = Array.from(
  { length: 48 },
  (_, index) => `${padTwoDigits(Math.floor(index / 2))}:${index % 2 ? "30" : "00"}`,
);
const DEFAULT_TIME = "19:00";

export type DateTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  min?: string;
  placeholder?: string;
};

export function DateTimePicker({
  value,
  onChange,
  id,
  invalid,
  min,
  placeholder,
}: DateTimePickerProps) {
  const [datePart = "", timePart = ""] = value ? value.split("T") : [];
  const time = timePart.slice(0, 5) || DEFAULT_TIME;
  // 예전에 30분 단위가 아닌 시각으로 저장된 값도 그대로 고를 수 있게 목록에 끼워 둔다.
  const values = TIME_VALUES.includes(time) ? TIME_VALUES : [time, ...TIME_VALUES];
  const items = values.map((timeValue) => ({ label: timeValue, value: timeValue }));

  const emit = (date: string, timeValue: string) => onChange(date ? `${date}T${timeValue}` : "");

  return (
    <div className="flex gap-2">
      <div className="min-w-0 flex-1">
        <DatePicker
          id={id}
          value={datePart}
          invalid={invalid}
          min={min}
          placeholder={placeholder}
          onChange={(date) => emit(date, time)}
        />
      </div>
      <div className="w-[112px] shrink-0">
        <Select.Root
          items={items}
          value={time}
          onValueChange={(timeValue) => emit(datePart, timeValue)}
        >
          <Select.Trigger aria-label="시각" />
          <Select.Popup>
            {items.map((option) => (
              <Select.Item key={option.value} value={option.value}>
                {option.label}
              </Select.Item>
            ))}
          </Select.Popup>
        </Select.Root>
      </div>
    </div>
  );
}
