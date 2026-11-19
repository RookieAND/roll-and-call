import { describe, expect, it } from "vitest";

import { attendanceRoundNo } from "./attendance-round-no";

const now = new Date("2026-12-12T12:00:00Z");
const rounds = [
  { roundNo: 1, startAt: new Date("2026-12-05T10:00:00Z") },
  { roundNo: 2, startAt: new Date("2026-12-12T10:00:00Z") },
  { roundNo: 3, startAt: new Date("2026-12-19T10:00:00Z") },
];

describe("출석 확인을 열 회차", () => {
  it("주소에 있는 회차를 연다", () => {
    expect(attendanceRoundNo({ rounds, requested: "1", now })).toBe(1);
  });

  it("없거나 잘못된 번호면 이미 시작한 가장 뒤 회차를 연다", () => {
    expect(attendanceRoundNo({ rounds, requested: undefined, now })).toBe(2);
    expect(attendanceRoundNo({ rounds, requested: "9", now })).toBe(2);
  });
});
