import { describe, expect, it } from "vitest";

import type { BadgeCounts } from "./badge-counts";
import { nextBadgeGoal } from "./next-badge-goal";

const counts = (overrides: Partial<BadgeCounts>): BadgeCounts => ({
  playerTotal: 0,
  gmTotal: 0,
  playerRules: [],
  gmRules: [],
  gmVariety: 0,
  ...overrides,
});

describe("nextBadgeGoal", () => {
  it("진행 비율이 가장 높은 단계형을 고른다", () => {
    const goal = nextBadgeGoal(
      counts({
        playerTotal: 8,
        playerRules: [{ categoryId: "coc", categoryName: "CoC", count: 2 }],
      }),
    );
    expect(goal).toMatchObject({ name: "떠돌이", count: 8, threshold: 10, remaining: 2 });
  });

  it("비율이 같으면 남은 횟수가 적은 것을 고른다", () => {
    const goal = nextBadgeGoal(
      counts({
        playerTotal: 5,
        gmRules: [{ categoryId: "coc", categoryName: "CoC", count: 4 }],
      }),
    );
    expect(goal).toMatchObject({ name: "CoC 연출가", remaining: 4 });
  });

  it("0회인 사다리는 후보가 아니다", () => {
    expect(nextBadgeGoal(counts({}))).toBeNull();
    expect(nextBadgeGoal(counts({ playerTotal: 1 }))).toMatchObject({ name: "떠돌이" });
  });

  it("모두 달성하면 null이다", () => {
    expect(nextBadgeGoal(counts({ playerTotal: 100 }))).toBeNull();
  });
});
