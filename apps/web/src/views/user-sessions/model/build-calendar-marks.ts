import { isNull } from "es-toolkit";

import type { SessionCardModel } from "@/widgets/session-list";

import { kstDateKey } from "./kst-date-key";
import type { UpcomingRow } from "./upcoming-row";

export type CalendarMarks = Record<string, { upcoming: boolean; past: boolean }>;

// 취소·가린 지난 카드와 일정 없는 줄은 달력에 점을 찍지 않는다.
export function buildCalendarMarks({
  upcomingRows,
  pastCards,
}: {
  upcomingRows: readonly UpcomingRow[];
  pastCards: readonly SessionCardModel[];
}): CalendarMarks {
  const marks: CalendarMarks = {};
  const mark = (value: Date | string, kind: "upcoming" | "past") => {
    const key = kstDateKey(value);
    marks[key] = { upcoming: false, past: false, ...marks[key], [kind]: true };
  };
  for (const row of upcomingRows) if (!isNull(row.startsAt)) mark(row.startsAt, "upcoming");
  for (const card of pastCards) {
    if (card.cancelled || card.hidden || isNull(card.startsAt)) continue;
    mark(card.startsAt, "past");
  }
  return marks;
}
