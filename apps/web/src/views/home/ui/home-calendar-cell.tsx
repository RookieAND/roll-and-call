import { cn } from "@trpg/ui";
import Link from "next/link";

import type { MonthCell } from "../model/build-month-cells";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";

// ponytail: 달력 칸은 버튼·칩 프리미티브와 모양이 달라 Link를 직접 칠한다.
export function HomeCalendarCell({
  cell,
  sessions,
  selected,
  today,
}: {
  cell: MonthCell;
  sessions: CalendarSession[];
  selected: boolean;
  today: boolean;
}) {
  const preview = sessions.find((session) => session.mine) ?? sessions[0];
  const restCount = sessions.length - 1;
  const ariaLabel = sessions.length > 0 ? `${cell.label} 세션 ${sessions.length}건` : cell.label;

  const cellTone = selected ? "bg-primary-600" : today ? "bg-tinted-bg" : "hover:bg-gray-50";
  const dayTone = selected
    ? "font-extrabold text-white"
    : today
      ? "font-extrabold text-primary-ink"
      : cell.inMonth
        ? (WEEKDAY_TONE[cell.weekday] ?? "text-gray-600")
        : "text-hint opacity-50";
  const previewTone = selected
    ? "bg-white/20 text-white"
    : preview?.mine
      ? "bg-primary-50 text-tinted-ink"
      : "bg-gray-100 text-gray-700";
  const restTone = selected ? "text-white/80" : "text-hint";
  const todayTone = selected ? "text-white" : "text-primary-ink";

  return (
    <Link
      href={`/?date=${cell.key}`}
      scroll={false}
      aria-label={ariaLabel}
      aria-current={selected ? "date" : undefined}
      className={cn("block h-[62px] rounded-lg px-[3px] py-1 transition-colors", cellTone)}
    >
      <span className={cn("block text-center text-[11.5px] font-semibold", dayTone)}>
        {cell.day}
      </span>
      {preview && (
        <span
          className={cn(
            "mt-[3px] block truncate rounded px-[3px] py-[3px] text-[10px] leading-none font-bold",
            previewTone,
          )}
        >
          {preview.title}
        </span>
      )}
      {restCount > 0 && (
        <span className={cn("mt-0.5 block text-center text-[9.5px] font-bold", restTone)}>
          외 {restCount}
        </span>
      )}
      {today && !preview && (
        <span className={cn("mt-1 block text-center text-[9px] font-bold", todayTone)}>오늘</span>
      )}
    </Link>
  );
}
