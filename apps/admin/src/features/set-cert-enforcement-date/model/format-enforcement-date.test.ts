import { describe, expect, it } from "vitest";

import { formatEnforcementDate } from "./format-enforcement-date";

describe("formatEnforcementDate", () => {
  const now = new Date("2026-09-22T23:30:00+09:00");

  it("요일과 남은 날을 서울 날짜로 센다", () => {
    expect(formatEnforcementDate(new Date("2026-10-02T00:00:00+09:00"), now)).toEqual({
      label: "2026년 10월 2일 (금)",
      remaining: "10일 남음",
    });
  });

  it("당일과 지난 날을 구분한다", () => {
    expect(formatEnforcementDate(new Date("2026-09-22T00:00:00+09:00"), now).remaining).toBe(
      "오늘 적용",
    );
    expect(formatEnforcementDate(new Date("2026-09-01T00:00:00+09:00"), now).remaining).toBe(
      "적용 중",
    );
  });
});
