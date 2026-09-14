"use client";

import { Popover } from "@base-ui-components/react/popover";
import { Calendar, Text, cn } from "@trpg/ui";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

// TextInput과 같은 규격(h-11 · r10 · gray-200 · text-sm · px-3). 옆에 놓여도 모양이 어긋나지 않게.
const triggerClass =
  "flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border bg-surface px-3 text-left text-sm outline-none transition-colors focus:ring-2";

const weekday = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", weekday: "short" });

// "2026-09-30" → "9월 30일 (수)". 앱 전체 날짜 표기와 맞춘다.
function displayDate(value: string) {
  const [y, m, d] = value.split("-").map(Number);
  if (!y || !m || !d) return value;
  // KST 정오로 만들어 어느 타임존에서 포맷해도 요일이 밀리지 않게 한다.
  const date = new Date(Date.UTC(y, m - 1, d, 3));
  return `${m}월 ${d}일 (${weekday.format(date)})`;
}

export type DatePickerProps = {
  value?: string;
  onChange: (date: string) => void;
  placeholder?: string;
  id?: string;
  invalid?: boolean;
  min?: string;
  max?: string;
};

export function DatePicker({
  value,
  onChange,
  placeholder = "날짜 선택",
  id,
  invalid,
  min,
  max,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const toneClass = invalid
    ? "border-[1.5px] border-danger-400 bg-danger-50 focus:ring-danger-200"
    : "border-gray-200 focus:border-primary-500 focus:ring-primary-100";

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger id={id} className={cn(triggerClass, toneClass)}>
        {value ? (
          <span className="truncate">{displayDate(value)}</span>
        ) : (
          <Text foreground="hint" className="truncate">
            {placeholder}
          </Text>
        )}
        <CalendarIcon size={16} aria-hidden className="shrink-0 text-gray-400" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={4} className="z-50">
          <Popover.Popup className="rounded-lg border border-gray-200 bg-surface p-2 shadow-lg outline-none">
            <Calendar
              value={value || undefined}
              min={min}
              max={max}
              onSelect={(d) => {
                onChange(d);
                setOpen(false);
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
