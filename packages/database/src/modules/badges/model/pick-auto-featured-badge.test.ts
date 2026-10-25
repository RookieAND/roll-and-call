import { describe, expect, it } from "vitest";

import type { EarnedBadge } from "./badge-facts";
import { BADGE_LADDER, HIDDEN_LADDER } from "./badge-ladder";
import { pickAutoFeaturedBadge } from "./pick-auto-featured-badge";

const earned = (badgeKey: string, tier: number, day: number): EarnedBadge => ({
  badgeKey,
  tier,
  earnedAt: new Date(Date.UTC(2026, 9, day)),
  sourceGameId: null,
});

describe("pickAutoFeaturedBadge", () => {
  it("등급이 가장 높은 칭호를 고른다", () => {
    expect(
      pickAutoFeaturedBadge([
        earned(HIDDEN_LADDER.nearMiss, 1, 1),
        earned(HIDDEN_LADDER.critical, 1, 2),
      ]),
    ).toBe(HIDDEN_LADDER.critical);
  });

  it("등급이 같으면 먼저 받은 것을 고른다", () => {
    expect(
      pickAutoFeaturedBadge([
        earned(HIDDEN_LADDER.critical, 1, 3),
        earned(HIDDEN_LADDER.fumble, 1, 2),
      ]),
    ).toBe(HIDDEN_LADDER.fumble);
  });

  it("이달의 GM·PL은 뺀다", () => {
    expect(pickAutoFeaturedBadge([earned(`${BADGE_LADDER.gmMonthly}.2026-09`, 1, 1)])).toBeNull();
  });

  it("받은 칭호가 없으면 없다", () => {
    expect(pickAutoFeaturedBadge([])).toBeNull();
  });
});
