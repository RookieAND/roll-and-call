import { describe, expect, it } from "vitest";

import { resolveCalendarMonth } from "./resolve-calendar-month";

const NOW = new Date("2026-11-24T12:00:00+09:00");
const monthOf = (input: { date?: string; month?: string }) =>
  resolveCalendarMonth({ ...input, now: NOW }).format("YYYY-MM");

describe("resolveCalendarMonth", () => {
  it("날짜의 달, month, 이번 달 순으로 고른다", () => {
    expect(monthOf({ date: "2026-12-03", month: "2027-01" })).toBe("2026-12");
    expect(monthOf({ month: "2027-01" })).toBe("2027-01");
    expect(monthOf({})).toBe("2026-11");
    expect(monthOf({ month: "2027-13" })).toBe("2026-11");
  });
});
