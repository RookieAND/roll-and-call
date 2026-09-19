"use client";

import { IconButton, Text, cn } from "@trpg/ui";
import { Plus, X } from "lucide-react";

import type { DayIntervalRow } from "../model/day-interval-row";
import { IntervalFields } from "./interval-fields";

export function AvailabilityDayEditor({
  label,
  rows,
  onToggle,
  onAdd,
  onRemove,
  onHourChange,
}: {
  label: string;
  rows: DayIntervalRow[];
  onToggle: () => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onHourChange: (index: number, edge: "from" | "to", hour: number) => void;
}) {
  const on = rows.length > 0;
  const chipClass = cn(
    "h-11 w-11 flex-none rounded-[11px] text-sm",
    on
      ? "bg-primary-600 font-bold text-white hover:bg-primary-700"
      : "border border-gray-200 font-semibold text-hint",
  );

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5">
        <IconButton
          aria-label={`${label}요일 ${on ? "끄기" : "켜기"}`}
          aria-pressed={on}
          className={chipClass}
          onClick={onToggle}
        >
          {label}
        </IconButton>
        {on ? (
          <IntervalFields
            label={label}
            row={rows[0]!}
            onHourChange={onHourChange}
            trailing={
              <IconButton
                variant="ghost"
                aria-label={`${label}요일 구간 추가`}
                className="h-11 w-10 flex-none text-primary-ink"
                onClick={onAdd}
              >
                <Plus size={16} aria-hidden />
              </IconButton>
            }
          />
        ) : (
          <div className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-[10px] border border-dashed border-gray-300">
            <Text typography="body4" foreground="hint" className="text-[12.5px]">
              안 되는 날
            </Text>
          </div>
        )}
      </div>

      {rows.slice(1).map((row) => (
        <div key={row.index} className="flex items-center gap-1.5">
          <span className="h-11 w-11 flex-none" />
          <IntervalFields
            label={label}
            row={row}
            onHourChange={onHourChange}
            trailing={
              <IconButton
                variant="ghost"
                aria-label={`${label}요일 구간 지우기`}
                className="h-11 w-10 flex-none"
                onClick={() => onRemove(row.index)}
              >
                <X size={15} aria-hidden />
              </IconButton>
            }
          />
        </div>
      ))}
    </div>
  );
}
