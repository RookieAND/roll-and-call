import { describe, expect, it } from "vitest";

import { monthSessions } from "./month-sessions";

const now = new Date("2026-11-11T03:00:00Z");
const card = (id: string, startsAt: string | null) => ({
  id,
  startsAt,
  cancelled: false,
  hidden: false,
  chip: "confirmed" as const,
});

describe("이번 달 예정된 세션", () => {
  it("한국 시간 기준 이번 달의 미래 일정만 가까운 순서로 표시한다", () => {
    const cards = [
      card("late", "2026-11-30T14:30:00Z"),
      card("next-month", "2026-11-30T15:00:00Z"),
      card("past", "2026-11-10T03:00:00Z"),
      card("soon", "2026-11-12T03:00:00Z"),
    ];
    expect(monthSessions({ cards, now }).map((c) => c.id)).toEqual(["soon", "late"]);
  });
  it("취소·숨김·대기·종료와 일정 미정을 제외한다", () => {
    const future = card("future", "2026-11-12T03:00:00Z");
    const cards = [
      { ...future, cancelled: true },
      { ...future, hidden: true },
      { ...future, chip: "waiting" as const },
      { ...future, chip: "ended" as const },
      card("undecided", null),
    ];
    expect(monthSessions({ cards, now })).toEqual([]);
  });
});
