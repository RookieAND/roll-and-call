import { Button, cn, IconButton, Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buildMonthCells } from "../model/build-month-cells";
import { DATE_KEY_FORMAT } from "../model/date-key-format";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";
import { HomeCalendarCell } from "./home-calendar-cell";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

export function HomeCalendar({
  monthStart,
  sessionsByDay,
  selectedKey,
  todayKey,
}: {
  monthStart: Dayjs;
  sessionsByDay: Map<string, CalendarSession[]>;
  selectedKey: string;
  todayKey: string;
}) {
  const cells = buildMonthCells(monthStart);
  const previousHref = `/?date=${monthStart.subtract(1, "month").format(DATE_KEY_FORMAT)}`;
  const nextHref = `/?date=${monthStart.add(1, "month").format(DATE_KEY_FORMAT)}`;

  return (
    <section>
      <div className="flex items-center gap-0.5 pt-3.5 pr-2.5 pb-2.5 pl-4">
        <Text typography="heading1" render={<h2 />} className="flex-1 text-[20px]">
          {monthStart.format("YYYY년 M월")}
        </Text>
        <Button asChild variant="outline" size="sm">
          <Link href="/" scroll={false}>
            오늘
          </Link>
        </Button>
        <IconButton asChild variant="ghost" aria-label="이전 달">
          <Link href={previousHref} scroll={false}>
            <ChevronLeft size={20} />
          </Link>
        </IconButton>
        <IconButton asChild variant="ghost" aria-label="다음 달">
          <Link href={nextHref} scroll={false}>
            <ChevronRight size={20} />
          </Link>
        </IconButton>
      </div>

      <div className="grid grid-cols-7 px-3 pb-1">
        {WEEKDAYS.map((weekday, index) => (
          <Text
            key={weekday}
            typography="subtitle2"
            foreground="hint"
            className={cn("text-center text-[11.5px]", WEEKDAY_TONE[index])}
          >
            {weekday}
          </Text>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-px px-3 pb-3">
        {cells.map((cell) => (
          <HomeCalendarCell
            key={cell.key}
            cell={cell}
            sessions={sessionsByDay.get(cell.key) ?? []}
            selected={cell.key === selectedKey}
            today={cell.key === todayKey}
          />
        ))}
      </div>

      <div className="flex items-center gap-3 px-4 pb-3 text-[11.5px] text-hint">
        <span className="flex items-center gap-[5px]">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-tinted-border bg-primary-50" />
          내가 참여
        </span>
        <span className="flex items-center gap-[5px]">
          <span className="h-2.5 w-2.5 rounded-[3px] border border-gray-300 bg-gray-100" />
          다른 세션
        </span>
      </div>
    </section>
  );
}
