import { describe, expect, it } from "vitest";

import { BADGE_ROLE } from "./badge-ladder";
import { monthLeaders } from "./month-leader";
import type { MonthlyAppearance } from "./monthly-winners";

const at = (day: number) => new Date(Date.UTC(2026, 9, day, 3));
const entry = (userId: string, day: number, weight: number): MonthlyAppearance => ({
  userId,
  role: BADGE_ROLE.gm,
  startsAt: at(day),
  weight,
  sessions: 1,
});

describe("monthLeaders", () => {
  it("점수가 가장 높은 사람을 고른다", () => {
    const appearances = [entry("a", 1, 100), entry("b", 2, 170)];
    expect(monthLeaders({ appearances, role: BADGE_ROLE.gm, month: "2026-10" })).toEqual(["b"]);
  });

  it("점수가 같으면 먼저 도달한 사람이 앞선다", () => {
    const appearances = [entry("a", 5, 100), entry("b", 2, 100)];
    expect(
      monthLeaders({ appearances, role: BADGE_ROLE.gm, month: "2026-10", breakTies: true }),
    ).toEqual(["b"]);
  });

  it("횟수제는 동점이면 공동 1위다", () => {
    const appearances = [entry("a", 5, 1), entry("b", 2, 1), entry("c", 3, 0)];
    expect(monthLeaders({ appearances, role: BADGE_ROLE.gm, month: "2026-10" }).toSorted()).toEqual(
      ["a", "b"],
    );
  });

  it("경쟁 상대가 없으면 1위로 보지 않는다", () => {
    expect(
      monthLeaders({ appearances: [entry("a", 1, 100)], role: BADGE_ROLE.gm, month: "2026-10" }),
    ).toEqual([]);
  });

  it("다른 달과 다른 역할은 세지 않는다", () => {
    const appearances = [
      entry("a", 1, 100),
      { ...entry("b", 1, 500), role: BADGE_ROLE.player },
      { ...entry("c", 1, 500), startsAt: new Date(Date.UTC(2026, 8, 20)) },
    ];
    expect(monthLeaders({ appearances, role: BADGE_ROLE.gm, month: "2026-10" })).toEqual([]);
  });
});
