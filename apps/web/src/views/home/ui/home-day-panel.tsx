"use client";

import type { CalendarSession } from "../model/to-calendar-sessions";
import { useSelectedDay } from "../model/use-selected-day";
import { HomeDaySessions } from "./home-day-sessions";

interface HomeDayPanelProps {
  sessionsByDay: Record<string, CalendarSession[]>;
  initialSelectedKey: string;
}

// 1100px 이상 우측 패널: 달력에서 고른 날의 세션 목록.
export function HomeDayPanel({ sessionsByDay, initialSelectedKey }: HomeDayPanelProps) {
  const { selected, selectedKey } = useSelectedDay(initialSelectedKey);

  return (
    <div className="overflow-clip rounded-700 border border-gray-200 bg-surface [&>section]:border-t-0">
      <HomeDaySessions
        stacked
        date={selected.toDate()}
        sessions={sessionsByDay[selectedKey] ?? []}
      />
    </div>
  );
}
