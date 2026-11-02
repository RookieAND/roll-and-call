import { describe, expect, it } from "vitest";

import { gameFilterCount } from "./game-filter-count";
import { hasGameFilters } from "./has-game-filters";

describe("gameFilterCount·hasGameFilters", () => {
  it("아무것도 안 고르면 0이고 필터 없음", () => {
    expect(gameFilterCount({})).toBe(0);
    expect(hasGameFilters({ rules: [], days: [], times: [], includeUnscheduled: true })).toBe(
      false,
    );
  });

  it("고른 조건 수에 일정 미정 끔을 1로 더한다", () => {
    const filter = { rules: ["other"], days: [0, 6], times: ["night" as const] };
    expect(gameFilterCount(filter)).toBe(4);
    expect(gameFilterCount({ ...filter, includeUnscheduled: false })).toBe(5);
    expect(hasGameFilters({ includeUnscheduled: false })).toBe(true);
    expect(hasGameFilters({ days: [3] })).toBe(true);
  });

  it("지정 구인 끔은 지난 구인 탭에서만 1로 센다", () => {
    expect(gameFilterCount({ tab: "past", includePrivate: false })).toBe(1);
    expect(gameFilterCount({ tab: "live", includePrivate: false })).toBe(0);
    expect(hasGameFilters({ tab: "past", includePrivate: false })).toBe(true);
    expect(hasGameFilters({ tab: "live", includePrivate: false })).toBe(false);
  });
});
