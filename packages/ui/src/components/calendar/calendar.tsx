"use client";

import { useState } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateClassName, StateStyle } from "../../lib/state-props";
import { daysInMonth } from "./days-in-month";
import { firstWeekday } from "./first-weekday";
import { toDateKey } from "./to-date-key";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type CalendarState = { value: string | undefined };

export interface CalendarProps {
  value?: string;
  onSelect: (date: string) => void;
  min?: string;
  max?: string;
  className?: StateClassName<CalendarState>;
  style?: StateStyle<CalendarState>;
}

export function Calendar({ value, onSelect, min, max, className, style }: CalendarProps) {
  const today = new Date();
  const [view, setView] = useState(() => {
    const anchor = value || min;
    if (anchor) {
      const [year, month] = anchor.split("-").map(Number);
      return { year: year!, month: month! };
    }
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  });

  const leadingBlanks = firstWeekday(view.year, view.month);
  const dayCount = daysInMonth(view.year, view.month);
  const cells: (number | null)[] = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: dayCount }, (_, index) => index + 1),
  ];

  const goToPreviousMonth = () =>
    setView((current) =>
      current.month === 1
        ? { year: current.year - 1, month: 12 }
        : { year: current.year, month: current.month - 1 },
    );
  const goToNextMonth = () =>
    setView((current) =>
      current.month === 12
        ? { year: current.year + 1, month: 1 }
        : { year: current.year, month: current.month + 1 },
    );

  return (
    <div
      data-slot="calendar"
      className={cn("w-64 select-none", resolveStateProp(className, { value }))}
      style={resolveStateProp(style, { value })}
    >
      <div data-slot="calendar-header" className="flex items-center justify-between px-050 py-050">
        <button
          type="button"
          data-slot="calendar-previous"
          onClick={goToPreviousMonth}
          aria-label="이전 달"
          className="h-7 w-7 rounded-200 text-gray-500 hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium">
          {view.year}년 {view.month}월
        </span>
        <button
          type="button"
          data-slot="calendar-next"
          onClick={goToNextMonth}
          aria-label="다음 달"
          className="h-7 w-7 rounded-200 text-gray-500 hover:bg-gray-100"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-hint">
        {WEEKDAYS.map((weekday) => (
          <div key={weekday} className="py-050">
            {weekday}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-025 text-center text-sm">
        {cells.map((day, index) => {
          if (day === null) return <div key={index} />;
          const date = toDateKey(view.year, view.month, day);
          const selected = value === date;
          const disabled = Boolean((min && date < min) || (max && date > max));
          return (
            <button
              key={index}
              type="button"
              disabled={disabled}
              data-slot="calendar-day"
              data-selected={selected ? "" : undefined}
              data-disabled={disabled ? "" : undefined}
              onClick={() => onSelect(date)}
              className={cn(
                "h-8 rounded-200 hover:bg-primary-50",
                selected && "bg-primary-600 text-white hover:bg-primary-700",
                disabled && "cursor-not-allowed text-gray-300 line-through hover:bg-transparent",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
