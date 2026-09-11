"use client";

import { Popover } from "@base-ui-components/react/popover";
import { Calendar, Text, cn } from "@trpg/ui";
import { Calendar as CalendarIcon } from "lucide-react";
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
        className={cn(triggerClass, invalid ? "border-danger-400" : "border-gray-300")}
      >
        {value ? <span>{value}</span> : <Text foreground="hint">{placeholder}</Text>}
        <CalendarIcon size={16} aria-hidden className="text-gray-500" />
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
