import { describe, expect, it } from "vitest";

import { isDeadlinePassed } from "./is-deadline-passed";
import { isDeadlineUrgent } from "./is-deadline-urgent";

const NOW = new Date("2026-09-11T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const fromNow = (hours: number) => new Date(NOW.getTime() + hours * HOUR);

describe("isDeadlineUrgent", () => {
  it("하루 안쪽이면 급하다", () => {
    expect(isDeadlineUrgent(fromNow(5), NOW)).toBe(true);
  });

  it("하루를 넘기면 급하지 않다", () => {
    expect(isDeadlineUrgent(fromNow(30), NOW)).toBe(false);
  });

  it("이미 지난 기한은 급한 것이 아니라 끝난 것이다", () => {
    expect(isDeadlineUrgent(fromNow(-1), NOW)).toBe(false);
  });
});

describe("isDeadlinePassed", () => {
  it("지난 기한과 남은 기한을 가른다", () => {
    expect(isDeadlinePassed(fromNow(-1), NOW)).toBe(true);
    expect(isDeadlinePassed(fromNow(1), NOW)).toBe(false);
  });
});
