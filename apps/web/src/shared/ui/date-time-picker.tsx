"use client";

import { HStack, Select, VStack } from "@roll-and-call/ui";

import { padTwoDigits } from "@/shared/lib";

import { DatePicker } from "./date-picker";

const HOUR_ITEMS = Array.from({ length: 24 }, (_, hour) => {
  const value = padTwoDigits(hour);
  return { label: `${hour}시`, value };
});
const MINUTE_STEP = 5;
const MINUTE_VALUES = Array.from({ length: 60 / MINUTE_STEP }, (_, index) =>
  padTwoDigits(index * MINUTE_STEP),
);
const DEFAULT_TIME = "19:00";

export interface DateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  id?: string;
  invalid?: boolean;
  min?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker({
  value,
  onChange,
  id,
  invalid,
  min,
  placeholder,
  disabled = false,
}: DateTimePickerProps) {
  const [datePart = "", timePart = ""] = value ? value.split("T") : [];
  const time = timePart.slice(0, 5) || DEFAULT_TIME;
  const [hour = "19", minute = "00"] = time.split(":");
  // 예전에 5분 단위가 아닌 시각으로 저장된 값도 그대로 고를 수 있게 목록에 끼워 둔다.
  const minuteValues = MINUTE_VALUES.includes(minute) ? MINUTE_VALUES : [minute, ...MINUTE_VALUES];
  const minuteItems = minuteValues.map((minuteValue) => ({
    label: `${Number(minuteValue)}분`,
    value: minuteValue,
  }));

  const emit = (date: string, timeValue: string) => onChange(date ? `${date}T${timeValue}` : "");

  return (
    <VStack gap="100">
      <div>
        <DatePicker
          id={id}
          value={datePart}
          invalid={invalid}
          min={min}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(date) => emit(date, time)}
        />
      </div>
      <HStack gap="100">
        <div className="min-w-0 flex-1">
          <Select.Root
            items={HOUR_ITEMS}
            value={hour}
            disabled={disabled}
            onValueChange={(next) => emit(datePart, `${next}:${minute}`)}
          >
            <Select.Trigger aria-label="시" />
            <Select.Popup>
              {HOUR_ITEMS.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        </div>
        <div className="min-w-0 flex-1">
          <Select.Root
            items={minuteItems}
            value={minute}
            disabled={disabled}
            onValueChange={(next) => emit(datePart, `${hour}:${next}`)}
          >
            <Select.Trigger aria-label="분" />
            <Select.Popup>
              {minuteItems.map((option) => (
                <Select.Item key={option.value} value={option.value}>
                  {option.label}
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Root>
        </div>
      </HStack>
    </VStack>
  );
}
