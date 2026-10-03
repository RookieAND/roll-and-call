import { describe, expect, it } from "vitest";

import { isAttendanceDue } from "./is-attendance-due";

const NOW = new Date("2026-09-11T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const startedTwoHoursAgo = {
  confirmedAt: new Date(NOW.getTime() - 2 * HOUR),
  playMinutes: 360,
  attendanceConfirmedAt: null,
};
const ended = { ...startedTwoHoursAgo, playMinutes: 60 };

describe("isAttendanceDue", () => {
  it("시작만으로는 생기지 않는다 — 플레이타임만큼 지나야 끝난 것이다", () => {
    expect(isAttendanceDue({ game: startedTwoHoursAgo, confirmedCount: 3, now: NOW })).toBe(false);
  });

  it("끝난 세션에는 출석 확인이 남는다", () => {
    expect(isAttendanceDue({ game: ended, confirmedCount: 3, now: NOW })).toBe(true);
  });

  it("확정 참여자가 없으면 정할 것이 없다", () => {
    expect(isAttendanceDue({ game: ended, confirmedCount: 0, now: NOW })).toBe(false);
  });

  it("이미 확정했으면 할 일이 아니다", () => {
    expect(
      isAttendanceDue({
        game: { ...ended, attendanceConfirmedAt: NOW },
        confirmedCount: 3,
        now: NOW,
      }),
    ).toBe(false);
  });

  it("시간이 정해지지 않은 세션은 끝날 수도 없다", () => {
    expect(
      isAttendanceDue({ game: { ...ended, confirmedAt: null }, confirmedCount: 3, now: NOW }),
    ).toBe(false);
  });

  it("기한(종료 + 7일)이 지나면 할 일이 아니다", () => {
    const longAgo = { ...ended, confirmedAt: new Date(NOW.getTime() - 8 * 24 * HOUR) };
    expect(isAttendanceDue({ game: longAgo, confirmedCount: 3, now: NOW })).toBe(false);
  });
});
