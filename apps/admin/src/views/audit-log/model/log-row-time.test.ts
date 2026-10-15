import { describe, expect, it } from "vitest";

import { logRowTime } from "./log-row-time";

describe("logRowTime", () => {
  const now = new Date("2026-09-22T15:00:00+09:00");

  it("오늘은 「오늘」과 시각만 보인다", () => {
    expect(logRowTime(new Date("2026-09-22T11:02:00+09:00"), now)).toBe("오늘 11:02");
  });

  it("올해는 연도를 뺀다", () => {
    expect(logRowTime(new Date("2026-09-21T23:40:00+09:00"), now)).toBe("9월 21일 23:40");
  });

  it("지난해는 연도를 붙인다", () => {
    expect(logRowTime(new Date("2025-12-31T08:05:00+09:00"), now)).toBe("2025년 12월 31일 08:05");
  });
});
