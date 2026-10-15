import { describe, expect, it } from "vitest";

import { isDeadlinePassed } from "./is-deadline-passed";

const NOW = new Date("2026-09-11T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const fromNow = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

describe("isDeadlinePassed", () => {
  it("지난 기한과 남은 기한을 가른다", () => {
    expect(isDeadlinePassed(fromNow(-1), NOW)).toBe(true);
    expect(isDeadlinePassed(fromNow(1), NOW)).toBe(false);
  });
});
