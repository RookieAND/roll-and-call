import { describe, expect, it } from "vitest";

import { overlappingRoundNumbers } from "./overlapping-round-numbers";

const HOUR = 3_600_000;
const base = new Date("2026-12-05T03:00:00Z").getTime();
const span = (startHour: number, hours: number) => ({
  startsAt: new Date(base + startHour * HOUR),
  endsAt: new Date(base + (startHour + hours) * HOUR),
});
const target = [
  { roundNo: 1, ...span(0, 4) },
  { roundNo: 2, ...span(168, 4) },
  { roundNo: 3, ...span(336, 4) },
];

describe("overlappingRoundNumbers", () => {
  it("일부만 겹쳐도 그 회차 번호를 돌려준다", () => {
    expect(overlappingRoundNumbers({ target, others: [span(3, 2)] })).toEqual([1]);
  });

  it("뒤 회차만 겹치는 경우도 찾는다", () => {
    expect(overlappingRoundNumbers({ target, others: [span(170, 1), span(330, 8)] })).toEqual([
      2, 3,
    ]);
  });

  it("끝과 시작이 맞닿으면 겹치지 않는다", () => {
    expect(overlappingRoundNumbers({ target, others: [span(-2, 2), span(4, 2)] })).toEqual([]);
  });
});
