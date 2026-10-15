"use client";

import { cn, HStack, Text, VStack } from "@roll-and-call/ui";
import Link from "next/link";
import type { MouseEvent } from "react";

import { useServerPath } from "@/shared/lib";

import type { MonthCell } from "../model/build-month-cells";
import { CALENDAR_CELL_TONE, calendarCellState } from "../model/calendar-cell-tone";
import { MAX_CALENDAR_DOTS, MAX_CALENDAR_NAMES, splitDotRows } from "../model/split-dot-rows";
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
  const selectedInMonth = selected && cell.inMonth;
  const hiddenNameCount = sessions.length - MAX_CALENDAR_NAMES;
  const dotTone = (session: CalendarSession) =>
    tone.dot ?? (session.mine ? "bg-primary-600" : "bg-hint");
  const nameDotTone = (session: CalendarSession) => (session.mine ? "bg-primary-600" : "bg-hint");

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
        "desktop:h-auto desktop:min-h-28 desktop:justify-start desktop:gap-050 desktop:overflow-hidden desktop:rounded-none desktop:p-100 desktop:transition-none desktop:hover:brightness-97",
        cell.inMonth ? "desktop:bg-surface" : "desktop:bg-canvas",
        selectedInMonth &&
          "desktop:bg-tinted-bg desktop:ring-2 desktop:ring-(color:--rc-color-border-primary-strong) desktop:ring-inset",
        tone.cell,
      )}
    >
      <Text
        typography="body4"
        weight={tone.day ? "extrabold" : "medium"}
        tight
        className={cn(
          "block text-center desktop:flex desktop:h-6 desktop:min-w-6 desktop:items-center desktop:justify-center desktop:self-start desktop:rounded-full desktop:px-075",
          weekdayTone,
          tone.day,
          today && "desktop:bg-primary-600 desktop:text-on-primary",
          !today && selectedInMonth && "desktop:text-tinted-ink",
        )}
      >
        {cell.day}
      </Text>
      {lead && (
        <VStack
          aria-hidden
          align="center"
          justify="center"
          gap="050"
          render={<span />}
          className="desktop:hidden"
        >
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
      {lead && (
        <span aria-hidden className="hidden min-w-0 desktop:block">
          <VStack gap="050" render={<span />}>
            {dots.slice(0, MAX_CALENDAR_NAMES).map((session) => (
              <HStack
                key={session.id}
                align="center"
                gap="050"
                render={<span />}
                title={session.title}
                className="min-w-0"
              >
                <span className={cn("size-1.5 flex-none rounded-full", nameDotTone(session))} />
                <Text
                  typography="body5"
                  weight={session.mine ? "bold" : "medium"}
                  tight
                  render={<span />}
                  className={cn("min-w-0 flex-1 truncate", !session.mine && "text-gray-600")}
                >
                  {session.title}
                </Text>
              </HStack>
            ))}
            {hiddenNameCount > 0 && (
              <Text
                typography="body5"
                weight="bold"
                tight
                foreground="hint"
                render={<span />}
                className="pl-125"
              >
                +{hiddenNameCount}건
              </Text>
            )}
          </VStack>
        </span>
      )}
      {today && sessions.length === 0 && (
        <Text
          weight="bold"
          typography="body5"
          tight
          className={cn("block text-center desktop:hidden", tone.today)}
        >
          오늘
        </Text>
      )}
      {!lead && !today && <span aria-hidden className="h-1.5 desktop:hidden" />}
    </Link>
  );
}
