"use client";

import { cn, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import type { MouseEvent } from "react";

import { useServerPath } from "@/shared/lib";

import type { MonthCell } from "../model/build-month-cells";
import { CALENDAR_CELL_TONE, calendarCellState } from "../model/calendar-cell-tone";
import { MAX_CALENDAR_DOTS, splitDotRows } from "../model/split-dot-rows";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";

interface HomeCalendarCellProps {
  cell: MonthCell;
  sessions: CalendarSession[];
  holidayNames?: readonly string[];
  selected: boolean;
  today: boolean;
}

// ponytail: 달력 칸은 버튼·칩 프리미티브와 모양이 달라 Link를 직접 칠한다.
export function HomeCalendarCell({
  cell,
  sessions,
  holidayNames,
  selected,
  today,
}: HomeCalendarCellProps) {
  const toServerPath = useServerPath();
  const mine = sessions.find((session) => session.mine);
  const lead = mine ?? sessions[0];
  const overflow = sessions.length > MAX_CALENDAR_DOTS;
  const dots = mine ? [mine, ...sessions.filter((session) => session !== mine)] : sessions;
  const dayLabel = holidayNames ? `${cell.label} ${holidayNames.join("·")}` : cell.label;
  const ariaLabel = sessions.length > 0 ? `${dayLabel} 세션 ${sessions.length}건` : dayLabel;
  const href = `${toServerPath("/")}?date=${cell.key}`;

  const tone =
    CALENDAR_CELL_TONE[calendarCellState({ selected, today, hasSessions: sessions.length > 0 })];
  const redDayTone = holidayNames ? "text-sunday" : WEEKDAY_TONE[cell.weekday];
  const weekdayTone = cell.inMonth ? (redDayTone ?? "text-gray-600") : "text-hint";
  const dayTone = tone.day ?? weekdayTone;
  const dotTone = (session: CalendarSession) =>
    tone.dot ?? (session.mine ? "bg-primary-600" : "bg-hint");

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
      className={cn(
        "flex h-14 min-w-0 flex-col justify-evenly rounded-300 px-050 transition-colors",
        tone.cell,
      )}
    >
      <Text
        typography="body4"
        weight={tone.day ? "extrabold" : "medium"}
        tight
        className={cn("block text-center", dayTone)}
      >
        {cell.day}
      </Text>
      {lead && (
        <VStack aria-hidden align="center" justify="center" gap="050" render={<span />}>
          {!overflow &&
            splitDotRows(dots).map((row) => (
              <HStack
                key={row[0]?.id}
                align="center"
                justify="center"
                gap="050"
                render={<span />}
                className="h-1.5"
              >
                {row.map((session) => (
                  <span
                    key={session.id}
                    className={cn("size-1.5 rounded-full", dotTone(session))}
                  />
                ))}
              </HStack>
            ))}
          {overflow && (
            <Text
              typography="body5"
              weight="extrabold"
              numeric
              tight
              className={cn(
                "inline-flex h-3 items-center gap-050 rounded-full pr-050 pl-025",
                tone.pill,
              )}
            >
              <span className={cn("size-1.5 rounded-full", dotTone(lead))} />
              {sessions.length}
            </Text>
          )}
        </VStack>
      )}
      {today && sessions.length === 0 && (
        <Text
          weight="bold"
          typography="body5"
          tight
          className={cn("block text-center", tone.today)}
        >
          오늘
        </Text>
      )}
      {!lead && !today && <span aria-hidden className="h-1.5" />}
    </Link>
  );
}
