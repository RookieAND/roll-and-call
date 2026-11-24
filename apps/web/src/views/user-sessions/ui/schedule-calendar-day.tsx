import { cn, HStack, Text, VStack } from "@roll-and-call/ui";

import type { MonthCell } from "@/shared/lib";
import { ServerLink } from "@/shared/ui";

import { calendarDayTone } from "../model/calendar-day-tone";

interface ScheduleCalendarDayProps {
  cell: MonthCell;
  mark?: { upcoming: boolean; past: boolean };
  today: boolean;
  selected: boolean;
  past: boolean;
  // 표시가 있는 날만 링크가 되고, 없는 날은 null이다.
  href: string | null;
}

export function ScheduleCalendarDay({
  cell,
  mark,
  today,
  selected,
  past,
  href,
}: ScheduleCalendarDayProps) {
  if (!cell.inMonth) return <span aria-hidden className="h-13" />;

  const circleTone = cn(selected && "bg-primary-600", !selected && today && "bg-primary-50");
  const dayTone = calendarDayTone({ selected, today, past, weekday: cell.weekday });
  const dayWeight = today || selected || mark ? "bold" : "regular";
  const labels = [
    cell.label,
    mark?.upcoming && "진행 예정 있음",
    mark?.past && "진행·완료 있음",
  ].filter(Boolean);
  const body = (
    <VStack align="center" justify="center" gap="075" className="h-13">
      <span className={cn("flex size-7.5 items-center justify-center rounded-full", circleTone)}>
        <Text typography="body3" weight={dayWeight} numeric className={dayTone}>
          {cell.day}
        </Text>
      </span>
      <HStack gap="025" className="h-1.25">
        {mark?.upcoming && <span aria-hidden className="size-1.25 rounded-full bg-primary-600" />}
        {mark?.past && <span aria-hidden className="size-1.25 rounded-full bg-gray-400" />}
      </HStack>
    </VStack>
  );

  if (href === null) return body;
  return (
    <ServerLink
      path={href}
      scroll={false}
      aria-label={labels.join(" ")}
      aria-current={selected ? "date" : undefined}
      className="rounded-300 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-tinted-ink"
    >
      {body}
    </ServerLink>
  );
}
