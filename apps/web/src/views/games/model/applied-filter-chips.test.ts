import { describe, expect, it } from "vitest";

import { appliedFilterChips } from "./applied-filter-chips";

const COC = "0b6f1c2e-1111-4a8b-9c0d-000000000001";
const GONE = "0b6f1c2e-1111-4a8b-9c0d-000000000009";

describe("appliedFilterChips", () => {
  it("룰·요일·시간대·일정 체크 순서로, 칩마다 그 조건만 뺀다", () => {
    const filter = {
      q: "호질",
      tab: "past" as const,
      rules: [GONE, COC],
      days: [6],
      times: ["evening" as const, "morning" as const],
      includeUnscheduled: false,
    };
    const chips = appliedFilterChips({
      filter,
      ruleOptions: [{ key: COC, label: "CoC 7th" }],
    });
    expect(chips.map((chip) => chip.label)).toEqual([
      "알 수 없는 룰",
      "CoC 7th",
      "토",
      "오전",
      "저녁",
      "일정 정해진 구인만",
    ]);
    expect(chips[1]!.filter).toEqual({ ...filter, rules: [GONE] });
    expect(chips[2]!.filter.days).toEqual([]);
    expect(chips[3]!.filter.times).toEqual(["evening"]);
    expect(chips[5]!.filter.includeUnscheduled).toBe(true);
  });

  it("필터가 없으면 칩도 없다", () => {
    expect(appliedFilterChips({ filter: {}, ruleOptions: [] })).toEqual([]);
  });
});
