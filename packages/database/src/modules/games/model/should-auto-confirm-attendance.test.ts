import { describe, expect, it } from "vitest";

import { shouldAutoConfirmAttendance } from "./should-auto-confirm-attendance";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const now = new Date("2026-10-03T00:00:00Z");
type Game = Parameters<typeof shouldAutoConfirmAttendance>[0]["game"];
const game: Game = {
  confirmedAt: new Date(now.getTime() - 8 * DAY),
  playMinutes: 120,
  endedAt: null,
  attendanceConfirmedAt: null,
  cancelledAt: null,
};
const check = (
  overrides: Partial<Game> & { confirmedCount?: number; onlyPastDeadline?: boolean },
) => {
  const { confirmedCount = 2, onlyPastDeadline = true, ...rest } = overrides;
  return shouldAutoConfirmAttendance({
    game: { ...game, ...rest },
    confirmedCount,
    now,
    onlyPastDeadline,
  });
};

describe("shouldAutoConfirmAttendance", () => {
  it("기한이 지난 미확정 세션은 확정한다", () => {
    expect(check({})).toBe(true);
  });

  it("기한 전이면 크론은 건너뛴다", () => {
    expect(check({ confirmedAt: new Date(now.getTime() - 6 * DAY) })).toBe(false);
  });

  it("바로 확정할 때는 시작한 세션이면 기한 전이어도 확정한다", () => {
    expect(check({ confirmedAt: new Date(now.getTime() - HOUR), onlyPastDeadline: false })).toBe(
      true,
    );
  });

  it("시작 전 세션은 확정하지 않는다", () => {
    expect(check({ confirmedAt: new Date(now.getTime() + HOUR), onlyPastDeadline: false })).toBe(
      false,
    );
  });

  it("확정 참여자가 없거나, 이미 확정했거나, 취소한 구인은 건너뛴다", () => {
    expect(check({ confirmedCount: 0 })).toBe(false);
    expect(check({ attendanceConfirmedAt: now })).toBe(false);
    expect(check({ cancelledAt: now })).toBe(false);
  });
});
