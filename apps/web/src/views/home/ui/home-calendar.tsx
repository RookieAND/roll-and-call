"use client";

import { Button, cn, Grid, HStack, IconButton, Skeleton, Text } from "@roll-and-call/ui";
import { useQuery } from "@tanstack/react-query";
import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useServerPath } from "@/shared/lib";

import { buildMonthCells } from "../model/build-month-cells";
import { DATE_KEY_FORMAT } from "../model/date-key-format";
import { holidayQuery } from "../model/holiday-query";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";
import { HomeCalendarCell } from "./home-calendar-cell";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

interface HomeCalendarProps {
  monthStart: Dayjs;
  sessionsByDay?: Record<string, CalendarSession[]>;
  hasNextMonthSessions?: boolean;
  selectedKey?: string;
  todayKey?: string;
}

export function HomeCalendar({
  monthStart,
  sessionsByDay,
  hasNextMonthSessions = true,
  selectedKey,
  todayKey,
}: HomeCalendarProps) {
  const toServerPath = useServerPath();
  const cells = buildMonthCells(monthStart);
  const { data: holidays } = useQuery(holidayQuery(monthStart.year()));
  const previousHref = `${toServerPath("/")}?date=${monthStart.subtract(1, "month").format(DATE_KEY_FORMAT)}`;
  const nextHref = `${toServerPath("/")}?date=${monthStart.add(1, "month").format(DATE_KEY_FORMAT)}`;

  return (
    <section>
      <HStack align="center" gap="025" className="pt-175 pr-125 pb-125 pl-200">
        <Text typography="heading2" render={<h2 />} className="flex-1">
          {monthStart.format("YYYY년 M월")}
        </Text>
        <Button
          render={<Link href={toServerPath("/")} scroll={false} />}
          variant="outline"
          size="sm"
        >
          오늘
        </Button>
        <IconButton
          render={<Link href={previousHref} scroll={false} />}
          variant="ghost"
          aria-label="이전 달"
        >
          <ChevronLeft size={20} />
        </IconButton>
        <IconButton
          render={hasNextMonthSessions ? <Link href={nextHref} scroll={false} /> : undefined}
          variant="ghost"
          aria-label="다음 달"
          disabled={!hasNextMonthSessions}
        >
          <ChevronRight size={20} />
        </IconButton>
      </HStack>

      <Grid className="grid-cols-7 px-150 pb-050">
        {WEEKDAYS.map((weekday, index) => (
          <Text
            weight="bold"
            key={weekday}
            typography="body4"
            foreground="hint"
            className={cn("text-center", WEEKDAY_TONE[index])}
          >
            {weekday}
          </Text>
        ))}
      </Grid>

      <Grid className="grid-cols-7 gap-025 px-150 pb-150">
        {cells.map((cell) =>
          sessionsByDay ? (
            <HomeCalendarCell
              key={cell.key}
              cell={cell}
              sessions={sessionsByDay[cell.key] ?? []}
              holidayNames={holidays?.[cell.key]}
              selected={cell.key === selectedKey}
              today={cell.key === todayKey}
            />
          ) : (
            <Skeleton key={cell.key} rounded={300} className="h-14" />
          ),
        )}
      </Grid>
      <HStack align="center" gap="150" className="px-200 pb-150 text-body4 text-hint">
        <span className="flex items-center gap-075">
          <span className="size-1.5 rounded-full bg-primary-600" />
          내가 참여
        </span>
        <span className="flex items-center gap-075">
          <span className="size-1.5 rounded-full bg-hint" />
          다른 세션
        </span>
      </HStack>
    </section>
  );
}
