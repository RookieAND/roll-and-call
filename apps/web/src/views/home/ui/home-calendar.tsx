import { Button, cn, IconButton, Skeleton, Text } from "@trpg/ui";
import type { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { buildMonthCells } from "../model/build-month-cells";
import { DATE_KEY_FORMAT } from "../model/date-key-format";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { WEEKDAY_TONE } from "../model/weekday-tone";
import { HomeCalendarCell } from "./home-calendar-cell";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

// sessionsByDay 없이 부르면 달 이름·요일·칸 수는 그대로 두고 칸만 스켈레톤으로 깐다.
export function HomeCalendar({
  monthStart,
  sessionsByDay,
  selectedKey,
  todayKey,
}: {
  monthStart: Dayjs;
  sessionsByDay?: Map<string, CalendarSession[]>;
  selectedKey?: string;
  todayKey?: string;
}) {
  const cells = buildMonthCells(monthStart);
  const previousHref = `/?date=${monthStart.subtract(1, "month").format(DATE_KEY_FORMAT)}`;
  const nextHref = `/?date=${monthStart.add(1, "month").format(DATE_KEY_FORMAT)}`;

  return (
    <section>
      <div className="flex items-center gap-025 pt-175 pr-125 pb-125 pl-200">
        <Text typography="heading2" render={<h2 />} className="flex-1">
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

      <div className="grid grid-cols-7 px-150 pb-050">
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
      </div>

      <div className="grid grid-cols-7 gap-px px-150 pb-150">
        {cells.map((cell) =>
          sessionsByDay ? (
            <HomeCalendarCell
              key={cell.key}
              cell={cell}
              sessions={sessionsByDay.get(cell.key) ?? []}
              selected={cell.key === selectedKey}
              today={cell.key === todayKey}
            />
          ) : (
            <Skeleton key={cell.key} className="h-[62px] rounded-300" />
          ),
        )}
      </div>

      <div className="flex items-center gap-150 px-200 pb-150 text-body4 text-hint">
        <span className="flex items-center gap-075">
          <span className="h-2.5 w-2.5 rounded-100 border border-tinted-border bg-primary-50" />
          내가 참여
        </span>
        <span className="flex items-center gap-075">
          <span className="h-2.5 w-2.5 rounded-100 border border-gray-300 bg-gray-100" />
          다른 세션
        </span>
      </div>
    </section>
  );
}
