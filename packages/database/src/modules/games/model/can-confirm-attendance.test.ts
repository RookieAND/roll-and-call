import { describe, expect, it } from "vitest";

import { canConfirmAttendance } from "./can-confirm-attendance";

const start = new Date("2026-10-26T12:00:00Z");
const game = { confirmedAt: start, playMinutes: 180, endedAt: null };
const at = (hours: number) => new Date(start.getTime() + hours * 3_600_000);

describe("canConfirmAttendance", () => {
  it("시작 전에는 못 하고 시작하면 끝나기 전에도 할 수 있다", () => {
    expect(canConfirmAttendance({ game, confirmedCount: 3, now: at(-1) })).toBe(false);
    expect(canConfirmAttendance({ game, confirmedCount: 3, now: at(0) })).toBe(true);
    expect(canConfirmAttendance({ game, confirmedCount: 3, now: at(1) })).toBe(true);
  });

  it("종료 판정 24시간 뒤에는 못 한다", () => {
    expect(canConfirmAttendance({ game, confirmedCount: 3, now: at(3 + 23) })).toBe(true);
    expect(canConfirmAttendance({ game, confirmedCount: 3, now: at(3 + 24) })).toBe(false);
  });

  it("확정 참여자가 없거나 일시가 없으면 못 한다", () => {
    expect(canConfirmAttendance({ game, confirmedCount: 0, now: at(1) })).toBe(false);
    expect(
      canConfirmAttendance({ game: { ...game, confirmedAt: null }, confirmedCount: 3, now: at(1) }),
    ).toBe(false);
  });
});
