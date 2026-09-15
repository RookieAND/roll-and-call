"use client";

import { Popover } from "@base-ui-components/react/popover";
import { Calendar, Text, cn } from "@trpg/ui";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

import { formatPickerDate } from "./format-picker-date";

const triggerClass =
  "flex h-11 w-full items-center justify-between gap-2 rounded-[10px] border bg-surface px-3 text-left text-sm outline-none transition-colors focus:ring-2";

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
          <span className="truncate">{formatPickerDate(value)}</span>
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
              onSelect={(date) => {
                onChange(date);
                setOpen(false);
              }}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
