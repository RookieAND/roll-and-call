"use client";

import { useState } from "react";
import { cn } from "./cn";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (y: number, m: number, d: number) => `${y}-${pad(m)}-${pad(d)}`;

// m is 1-12
const daysInMonth = (y: number, m: number) =>
  new Date(Date.UTC(y, m, 0)).getUTCDate();
const firstWeekday = (y: number, m: number) =>
  new Date(Date.UTC(y, m - 1, 1)).getUTCDay();

export type CalendarProps = {
  value?: string;
  onSelect: (date: string) => void;
  // inclusive YYYY-MM-DD bounds; dates outside are shown disabled
  min?: string;
  max?: string;
};

export function Calendar({ value, onSelect, min, max }: CalendarProps) {
  const today = new Date();
  const [view, setView] = useState(() => {
    const anchor = value || min;
    if (anchor) {
      const [y, m] = anchor.split("-").map(Number);
      return { y: y!, m: m! };
    }
    return { y: today.getFullYear(), m: today.getMonth() + 1 };
  });

  const lead = firstWeekday(view.y, view.m);
  const dim = daysInMonth(view.y, view.m);
  const cells: (number | null)[] = [
    ...Array.from({ length: lead }, () => null),
    ...Array.from({ length: dim }, (_, i) => i + 1),
  ];

  const prev = () =>
    setView((v) => (v.m === 1 ? { y: v.y - 1, m: 12 } : { y: v.y, m: v.m - 1 }));
  const next = () =>
    setView((v) => (v.m === 12 ? { y: v.y + 1, m: 1 } : { y: v.y, m: v.m + 1 }));

  return (
    <div className="w-64 select-none">
      <div className="flex items-center justify-between px-1 py-1">
        <button
          type="button"
          onClick={prev}
          aria-label="이전 달"
          className="h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100"
        >
          ‹
        </button>
        <span className="text-sm font-medium">
          {view.y}년 {view.m}월
        </span>
        <button
          type="button"
          onClick={next}
          aria-label="다음 달"
          className="h-7 w-7 rounded-md text-gray-500 hover:bg-gray-100"
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 text-center text-xs text-gray-400">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-center text-sm">
        {cells.map((d, i) => {
          if (d === null) return <div key={i} />;
          const date = ymd(view.y, view.m, d);
          const selected = value === date;
          const disabled = Boolean(
            (min && date < min) || (max && date > max),
          );
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(date)}
              className={cn(
                "h-8 rounded-md hover:bg-primary-50",
                selected && "bg-primary-600 text-white hover:bg-primary-700",
                disabled &&
                  "cursor-not-allowed text-gray-300 line-through hover:bg-transparent",
              )}
            >
              {d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
