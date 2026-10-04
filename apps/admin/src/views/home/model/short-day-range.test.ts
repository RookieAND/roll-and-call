import { describe, expect, it } from "vitest";

import { shortDayRange } from "./short-day-range";

describe("shortDayRange", () => {
  it("같은 달이면 날짜만 줄여 쓴다", () => {
    expect(shortDayRange(new Date("2026-09-24T03:00:00Z"), new Date("2026-09-30T03:00:00Z"))).toBe(
      "24~30일",
    );
  });

  it("달이 바뀌면 양쪽에 일을 붙인다", () => {
    expect(shortDayRange(new Date("2026-09-28T03:00:00Z"), new Date("2026-10-04T03:00:00Z"))).toBe(
      "28일~4일",
    );
  });
});
