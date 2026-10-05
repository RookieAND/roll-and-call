import { describe, expect, it } from "vitest";

import { currentMonthStanding } from "./current-month-standing";
import { monthListLabel } from "./month-list-label";

describe("monthListLabel", () => {
  it("같은 해는 월만, 해가 바뀌면 연도를 다시 붙인다", () => {
    expect(monthListLabel(["2026-09", "2026-06"])).toBe("2026년 9월 · 6월");
    expect(monthListLabel(["2026-01", "2025-12", "2025-03"])).toBe(
      "2026년 1월 · 2025년 12월 · 3월",
    );
  });
});

describe("currentMonthStanding", () => {
  const now = new Date("2026-10-20T03:00:00Z");
  const at = new Date("2026-10-10T03:00:00Z");
  it("내 점수·순위와 1위 점수를 돌려준다", () => {
    const appearances = [
      { userId: "a", role: "pl" as const, startsAt: at, score: 100, sessions: 1 },
      { userId: "b", role: "pl" as const, startsAt: at, score: 100, sessions: 1 },
      { userId: "b", role: "pl" as const, startsAt: at, score: 100, sessions: 1 },
      { userId: "b", role: "gm" as const, startsAt: at, score: 100, sessions: 1 },
      {
        userId: "a",
        role: "pl" as const,
        startsAt: new Date("2026-09-10T03:00:00Z"),
        score: 100,
        sessions: 1,
      },
    ];
    expect(currentMonthStanding({ appearances, userId: "a", role: "pl", now })).toEqual({
      score: 100,
      rank: 2,
      sessionCount: 1,
      topScore: 200,
      topSessionCount: 2,
    });
    expect(currentMonthStanding({ appearances: [], userId: "a", role: "gm", now })).toEqual({
      score: 0,
      rank: null,
      sessionCount: 0,
      topScore: 0,
      topSessionCount: 0,
    });
  });
});
