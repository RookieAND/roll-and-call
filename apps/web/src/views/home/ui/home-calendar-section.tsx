"use client";

import { useSearchParams } from "next/navigation";

import { toKst } from "@/shared/lib";

import { resolveCalendarView } from "../model/resolve-calendar-view";
import type { CalendarSession } from "../model/to-calendar-sessions";
import { HomeCalendar } from "./home-calendar";
import { HomeDaySessions } from "./home-day-sessions";

interface HomeCalendarSectionProps {
  monthStart: Date;
  sessionsByDay: Record<string, CalendarSession[]>;
  initialSelectedKey: string;
  todayKey: string;
}

// 같은 달 안의 날짜 선택은 pushState로 주소만 바꾸므로, 선택 날짜는 서버 props가 아니라 주소에서 읽는다.
export function HomeCalendarSection({
  monthStart,
  sessionsByDay,
  initialSelectedKey,
  todayKey,
}: HomeCalendarSectionProps) {
  const searchParams = useSearchParams();
  const { selected, selectedKey } = resolveCalendarView(
    searchParams.get("date") ?? initialSelectedKey,
  );

  return (
    <>
      <HomeCalendar
        monthStart={toKst(monthStart)}
        sessionsByDay={sessionsByDay}
        selectedKey={selectedKey}
        todayKey={todayKey}
      />
      <HomeDaySessions date={selected.toDate()} sessions={sessionsByDay[selectedKey] ?? []} />
    </>
  );
}
