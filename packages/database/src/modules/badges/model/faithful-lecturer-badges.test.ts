import { describe, expect, it } from "vitest";

import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { computeBadges } from "./compute-badges";

const HOUR = 60 * 60 * 1000;

function session(day: number, gameId = `g${day}`): BadgeSession {
  const startsAt = new Date(Date.UTC(2026, 2, day, 3));
  return {
    gameId,
    title: gameId,
    startsAt,
    endsAt: new Date(startsAt.getTime() + HOUR),
    categoryId: null,
    categoryName: null,
    attendedCount: 4,
    registeredAt: new Date(Date.UTC(2026, 1, 1)),
  };
}

const facts = (overrides: Partial<BadgeFacts>): BadgeFacts => ({
  played: [],
  hosted: [],
  reviews: [],
  written: [],
  draws: [],
  hostedDraws: [],
  joinedAt: null,
  rush: [],
  fullCasts: [],
  absences: [],
  briefingIds: [],
  certified: [],
  asOf: new Date(Date.UTC(2027, 0, 1)),
  ...overrides,
});

const earned = (overrides: Partial<BadgeFacts>, key: string) =>
  computeBadges(facts(overrides)).some((badge) => badge.badgeKey === `sp.${key}`);

const days = (count: number, from = 1) =>
  Array.from({ length: count }, (_, index) => session(from + index));

describe("약속 지킴이", () => {
  it("불참 기록 없이 PL로 10번 참석하면 받는다", () => {
    expect(earned({ played: days(9) }, "faithful")).toBe(false);
    expect(earned({ played: days(10) }, "faithful")).toBe(true);
  });

  it("중간에 불참이 끼면 처음부터 다시 센다", () => {
    const absences = [{ at: new Date(Date.UTC(2026, 2, 5, 3)), gameId: "absent" }];
    const played = [...days(4), ...days(9, 6)];
    expect(earned({ played, absences }, "faithful")).toBe(false);
    expect(earned({ played: [...played, session(20)], absences }, "faithful")).toBe(true);
  });

  it("GM으로 진행한 세션은 세지 않는다", () => {
    expect(earned({ hosted: days(10) }, "faithful")).toBe(false);
  });
});

describe("명강사", () => {
  const hosted = days(4);
  it("내가 연 설명회가 3번째 인정 세션이 되면 받는다", () => {
    expect(earned({ hosted, briefingIds: ["g1", "g2"] }, "lecturer")).toBe(false);
    expect(earned({ hosted, briefingIds: ["g1", "g2", "g3"] }, "lecturer")).toBe(true);
  });

  it("인정 세션이 아닌 설명회는 세지 않는다", () => {
    expect(earned({ hosted: days(2), briefingIds: ["g1", "g2", "g3"] }, "lecturer")).toBe(false);
  });

  it("일반 세션은 세지 않는다", () => {
    expect(earned({ hosted, briefingIds: [] }, "lecturer")).toBe(false);
  });
});
