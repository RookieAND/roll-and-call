import { Card, cn, Grid, HStack, IconButton, Text, VStack } from "@roll-and-call/ui";
import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { SessionRole } from "@/entities/game";
import { buildMonthCells } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import type { CalendarMarks } from "../model/build-calendar-marks";
import { WEEKDAY_TONE } from "../model/calendar-day-tone";
import { scheduleHref } from "../model/schedule-href";
import { SCHEDULE_TAB, type ScheduleTab } from "../model/schedule-tab";
import { ScheduleCalendarDay } from "./schedule-calendar-day";

const MONTH_KEY_FORMAT = "YYYY-MM";
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

interface ScheduleCalendarProps {
  userId: string;
  role: SessionRole;
  tab: ScheduleTab;
  monthStart: Dayjs;
  marks: CalendarMarks;
  todayKey: string;
  selectedKey?: string;
}

export function ScheduleCalendar({
  userId,
  role,
  tab,
  monthStart,
  marks,
  todayKey,
  selectedKey,
}: ScheduleCalendarProps) {
  const monthKey = monthStart.format(MONTH_KEY_FORMAT);
  const monthHref = (target: Dayjs) =>
    scheduleHref({ userId, role, tab, month: target.format(MONTH_KEY_FORMAT) });
  const dayHref = (key: string) => {
    const mark = marks[key];
    if (!mark) return null;
    return scheduleHref({
      userId,
      role,
      tab: mark.upcoming ? SCHEDULE_TAB.upcoming : SCHEDULE_TAB.past,
      date: key === selectedKey ? undefined : key,
      month: monthKey,
    });
  };

  return (
    <Card.Root padding="md" className="bg-surface">
      <VStack gap="100">
        <HStack align="center" gap="025">
          <Text typography="subtitle1" className="min-w-0 flex-1" render={<h2 />}>
            {monthStart.format("YYYY년 M월")}
          </Text>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="이전 달"
            render={<ServerLink path={monthHref(monthStart.subtract(1, "month"))} scroll={false} />}
          >
            <ChevronLeft size={18} aria-hidden />
          </IconButton>
          <IconButton
            size="sm"
            variant="ghost"
            aria-label="다음 달"
            render={<ServerLink path={monthHref(monthStart.add(1, "month"))} scroll={false} />}
          >
            <ChevronRight size={18} aria-hidden />
          </IconButton>
        </HStack>
        <VStack gap="025">
          <Grid className="grid-cols-7 gap-025">
            {WEEKDAYS.map((label, index) => (
              <Text
                key={label}
                typography="body5"
                weight="bold"
                foreground="hint"
                className={cn("text-center", WEEKDAY_TONE[index])}
              >
                {label}
              </Text>
            ))}
          </Grid>
          <Grid className="grid-cols-7 gap-025">
            {buildMonthCells(monthStart).map((cell) => (
              <ScheduleCalendarDay
                key={cell.key}
                cell={cell}
                mark={marks[cell.key]}
                today={cell.key === todayKey}
                selected={cell.key === selectedKey}
                past={cell.key < todayKey}
                href={dayHref(cell.key)}
              />
            ))}
          </Grid>
        </VStack>
      </VStack>
    </Card.Root>
  );
}
