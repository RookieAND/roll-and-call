"use client";

import { cn, Text } from "@trpg/ui";
import Link from "next/link";
import type { MouseEvent } from "react";

import type { MonthCell } from "../model/build-month-cells";
import { CALENDAR_CELL_TONE, calendarCellState } from "../model/calendar-cell-tone";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";

interface HomeCalendarCellProps {
  cell: MonthCell;
  sessions: CalendarSession[];
  selected: boolean;
  today: boolean;
}

// ponytail: 달력 칸은 버튼·칩 프리미티브와 모양이 달라 Link를 직접 칠한다.
export function HomeCalendarCell({ cell, sessions, selected, today }: HomeCalendarCellProps) {
  const preview = sessions.find((session) => session.mine) ?? sessions[0];
  const restCount = sessions.length - 1;
  const ariaLabel = sessions.length > 0 ? `${cell.label} 세션 ${sessions.length}건` : cell.label;
  const href = `/?date=${cell.key}`;

  const tone = CALENDAR_CELL_TONE[calendarCellState(selected, today)];
  const weekdayTone = cell.inMonth
    ? (WEEKDAY_TONE[cell.weekday] ?? "text-gray-600")
    : "text-hint opacity-50";
  const dayTone = tone.day ?? weekdayTone;
  const previewTone =
    tone.preview ?? (preview?.mine ? "bg-primary-50 text-tinted-ink" : "bg-gray-100 text-gray-700");

  // 같은 달은 이미 받은 세션으로 그리므로 서버를 다시 부르지 않는다. 다른 달 칸과 새 탭 열기는 원래대로 이동한다.
  function selectDay(event: MouseEvent<HTMLAnchorElement>) {
    if (!cell.inMonth || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.history.pushState(null, "", href);
  }

  return (
    <Link
      href={href}
      scroll={false}
      prefetch={false}
      onClick={selectDay}
      aria-label={ariaLabel}
      aria-current={selected ? "date" : undefined}
      className={cn("block h-[62px] rounded-300 px-050 py-050 transition-colors", tone.cell)}
    >
      <Text
        typography="body4"
        weight={tone.day ? "extrabold" : "medium"}
        tight
        className={cn("block py-025 text-center", dayTone)}
      >
        {cell.day}
      </Text>
      {preview && (
        <Text
          weight="bold"
          typography="body5"
          tight
          truncate
          className={cn("mt-050 rounded-100 px-050 py-050", previewTone)}
        >
          {preview.title}
        </Text>
      )}
      {restCount > 0 && (
        <Text
          weight="bold"
          typography="body5"
          tight
          className={cn("mt-025 block text-center", tone.rest)}
        >
          외 {restCount}
        </Text>
      )}
      {today && !preview && (
        <Text
          weight="bold"
          typography="body5"
          tight
          className={cn("mt-050 block text-center", tone.today)}
        >
          오늘
        </Text>
      )}
    </Link>
  );
}
