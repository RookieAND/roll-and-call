import { describe, expect, it } from "vitest";

import {
  attendanceDeadline,
  isAttendancePastDeadline,
  isAutoConfirmedAttendance,
} from "./attendance-deadline";

const startsAt = new Date("2026-09-20T11:00:00Z");
const HOUR = 3_600_000;
const DAY = 24 * HOUR;

describe("attendanceDeadline", () => {
  it("세션 종료 7×24시간 뒤다", () => {
    expect(attendanceDeadline({ confirmedAt: startsAt, playMinutes: 120 })?.toISOString()).toBe(
      "2026-09-27T13:00:00.000Z",
    );
  });

  it("플레이타임이 없으면 3시간으로 본다", () => {
    expect(attendanceDeadline({ confirmedAt: startsAt, playMinutes: null })?.toISOString()).toBe(
      "2026-09-27T14:00:00.000Z",
    );
  });

  it("시간이 정해지지 않았으면 기한도 없다", () => {
    expect(attendanceDeadline({ confirmedAt: null, playMinutes: 120 })).toBeNull();
  });
});

describe("isAttendancePastDeadline", () => {
  const deadline = startsAt.getTime() + 2 * HOUR + 7 * DAY;
  const game = { confirmedAt: startsAt, playMinutes: 120 };

  it("기한 직전에는 지나지 않았다", () => {
    expect(isAttendancePastDeadline({ ...game, now: new Date(deadline - 1) })).toBe(false);
  });

  it("기한 시각부터 지났다", () => {
    expect(isAttendancePastDeadline({ ...game, now: new Date(deadline) })).toBe(true);
  });

  it("시간이 정해지지 않으면 지나지 않는다", () => {
    expect(
      isAttendancePastDeadline({ confirmedAt: null, playMinutes: 120, now: new Date(deadline) }),
    ).toBe(false);
  });
});

describe("isAutoConfirmedAttendance", () => {
  const game = { confirmedAt: startsAt, playMinutes: 120 };
  const deadline = new Date(startsAt.getTime() + 2 * HOUR + 7 * DAY);

  it("기한 시각에 확정했으면 자동 확정이다", () => {
    expect(isAutoConfirmedAttendance({ ...game, attendanceConfirmedAt: deadline })).toBe(true);
  });

  it("기한 직전에 확정했으면 GM이 확정한 것이다", () => {
    expect(
      isAutoConfirmedAttendance({
        ...game,
        attendanceConfirmedAt: new Date(deadline.getTime() - 1),
      }),
    ).toBe(false);
  });

  it("확정하지 않았으면 아니다", () => {
    expect(isAutoConfirmedAttendance({ ...game, attendanceConfirmedAt: null })).toBe(false);
  });
});
