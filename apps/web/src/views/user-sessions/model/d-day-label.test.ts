import { describe, expect, it } from "vitest";

import { dDayLabel } from "./d-day-label";
import { isImminentDay } from "./is-imminent-day";

const NOW = new Date("2026-11-24T12:00:00+09:00");

describe("dDayLabel", () => {
  it("당일은 D-Day, 이후는 D-n이다", () => {
    expect(dDayLabel({ target: new Date("2026-11-24T22:00:00+09:00"), now: NOW })).toBe("D-Day");
    expect(dDayLabel({ target: new Date("2026-11-27T10:00:00+09:00"), now: NOW })).toBe("D-3");
  });

  it("D-Day와 D-1만 임박으로 본다", () => {
    expect(isImminentDay({ target: new Date("2026-11-25T10:00:00+09:00"), now: NOW })).toBe(true);
    expect(isImminentDay({ target: new Date("2026-11-26T10:00:00+09:00"), now: NOW })).toBe(false);
  });
});
