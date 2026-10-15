"use client";

import { toKst } from "@/shared/lib";
import { DESKTOP_CARD_CLASS } from "@/shared/ui";

import type { CalendarSession } from "../model/to-calendar-sessions";
import { useSelectedDay } from "../model/use-selected-day";
import { HomeCalendar } from "./home-calendar";
import { HomeDaySessions } from "./home-day-sessions";

interface HomeCalendarSectionProps {
  monthStart: Date;
  sessionsByDay: Record<string, CalendarSession[]>;
  hasNextMonthSessions: boolean;
  initialSelectedKey: string;
  todayKey: string;
}

// 모바일은 달력 아래에 고른 날의 세션이 이어지고, 1100px 이상은 세션이 우측 패널(HomeDayPanel)로 간다.
export function HomeCalendarSection({
  monthStart,
  sessionsByDay,
  hasNextMonthSessions,
  initialSelectedKey,
  todayKey,
}: HomeCalendarSectionProps) {
  const { selected, selectedKey } = useSelectedDay(initialSelectedKey);

  return (
    <div className={DESKTOP_CARD_CLASS}>
      <HomeCalendar
        monthStart={toKst(monthStart)}
        sessionsByDay={sessionsByDay}
        hasNextMonthSessions={hasNextMonthSessions}
        selectedKey={selectedKey}
        todayKey={todayKey}
      />
      <div className="desktop:hidden">
        <HomeDaySessions date={selected.toDate()} sessions={sessionsByDay[selectedKey] ?? []} />
      </div>
    </div>
  );
}
