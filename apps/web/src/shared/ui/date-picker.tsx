"use client";

import { Popover } from "@base-ui-components/react/popover";
import { Calendar, cn } from "@trpg/ui";
import { useState } from "react";

const triggerClass =
  "flex w-full items-center justify-between rounded-md border bg-surface px-3 py-2 text-left text-sm outline-none transition-colors focus:ring-2 focus:border-primary-500 focus:ring-primary-100";

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

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        id={id}
        className={cn(triggerClass, invalid ? "border-red-400" : "border-gray-300")}
      >
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
        <span aria-hidden className="text-xs text-gray-400">
          📅
        </span>
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
