import { describe, expect, it } from "vitest";

import { isAttendanceSettled } from "./is-attendance-settled";

const NOW = new Date("2026-10-03T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const game = (startedAgo: number) => ({
  confirmedAt: new Date(NOW.getTime() - startedAgo),
  playMinutes: 60,
  attendanceConfirmedAt: null,
});

describe("isAttendanceSettled", () => {
  it("GM이 확정했으면 정해졌다", () => {
    expect(
      isAttendanceSettled({
        game: { ...game(2 * HOUR), attendanceConfirmedAt: NOW },
        confirmedCount: 3,
        now: NOW,
      }),
    ).toBe(true);
  });

  it("끝났지만 기한 전이면 아직이다", () => {
    expect(isAttendanceSettled({ game: game(2 * HOUR), confirmedCount: 3, now: NOW })).toBe(false);
  });

  it("기한이 지났으면 저장 전이어도 정해졌다", () => {
    expect(isAttendanceSettled({ game: game(8 * DAY), confirmedCount: 3, now: NOW })).toBe(true);
  });

  it("확정 참여자가 없으면 정할 것이 없다", () => {
    expect(isAttendanceSettled({ game: game(8 * DAY), confirmedCount: 0, now: NOW })).toBe(false);
  });
});
