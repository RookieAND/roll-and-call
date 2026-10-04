import { describe, expect, it } from "vitest";

import { parseGameFilters } from "./parse-game-filters";

const CATEGORY_A = "0b6f1c2e-1111-4a8b-9c0d-000000000001";
const CATEGORY_B = "0b6f1c2e-1111-4a8b-9c0d-000000000002";

describe("parseGameFilters", () => {
  it("값이 없으면 빈 목록과 일정 미정 켬", () => {
    expect(parseGameFilters({})).toEqual({
      rules: [],
      days: [],
      times: [],
      includeUnscheduled: true,
    });
  });

  it("모르는 값·중복을 버리고 정렬한다", () => {
    expect(
      parseGameFilters({
        rule: `other,${CATEGORY_B},nope,${CATEGORY_A.toUpperCase()},${CATEGORY_B}`,
        day: "6,0,6,7,x,-1,1.5",
        time: "night,morning,noon,night",
      }),
    ).toEqual({
      rules: [CATEGORY_A, CATEGORY_B, "other"],
      days: [0, 6],
      times: ["morning", "night"],
      includeUnscheduled: true,
    });
  });

  it("unscheduled=0만 false다", () => {
    expect(parseGameFilters({ unscheduled: "0" }).includeUnscheduled).toBe(false);
    expect(parseGameFilters({ unscheduled: "1" }).includeUnscheduled).toBe(true);
    expect(parseGameFilters({ unscheduled: "false" }).includeUnscheduled).toBe(true);
  });
});
