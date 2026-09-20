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
    expect(isAttendanceDue(startedTwoHoursAgo, 3, NOW)).toBe(false);
  });

  it("끝난 세션에는 출석 확인이 남는다", () => {
    expect(isAttendanceDue(ended, 3, NOW)).toBe(true);
  });

  it("확정 참여자가 없으면 정할 것이 없다", () => {
    expect(isAttendanceDue(ended, 0, NOW)).toBe(false);
  });

  it("이미 확정했으면 할 일이 아니다", () => {
    expect(isAttendanceDue({ ...ended, attendanceConfirmedAt: NOW }, 3, NOW)).toBe(false);
  });

  it("시간이 정해지지 않은 세션은 끝날 수도 없다", () => {
    expect(isAttendanceDue({ ...ended, confirmedAt: null }, 3, NOW)).toBe(false);
  });
});
