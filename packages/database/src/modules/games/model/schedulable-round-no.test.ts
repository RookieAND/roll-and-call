import { describe, expect, it } from "vitest";

import { schedulableRoundNo } from "./schedulable-round-no";

describe("조율형 일정 잡기", () => {
  it("일정 없는 가장 앞 회차만 잡을 수 있다", () => {
    const rounds = [
      { roundNo: 1, startAt: new Date() },
      { roundNo: 2, startAt: null },
      { roundNo: 3, startAt: null },
    ];
    expect(schedulableRoundNo(rounds)).toBe(2);
  });

  it("모두 일정이 있으면 없다", () => {
    expect(schedulableRoundNo([{ roundNo: 1, startAt: new Date() }])).toBeNull();
  });
});
