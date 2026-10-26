import { describe, expect, it } from "vitest";

import { REVIEW_WINDOW, reviewWindowOf, reviewWriteDeadline } from "./review-window";

const start = new Date("2026-10-26T12:00:00Z");
const game = { confirmedAt: start, playMinutes: 180, endedAt: null };
const hours = (count: number) => new Date(start.getTime() + count * 3_600_000);

describe("reviewWindowOf", () => {
  it("시작 전에는 열리지 않고 시작하면 출석 확정 없이 열린다", () => {
    expect(reviewWindowOf(game, hours(-1))).toBe(REVIEW_WINDOW.notStarted);
    expect(reviewWindowOf(game, hours(0))).toBe(REVIEW_WINDOW.open);
  });

  it("종료 판정 + 7일에 닫힌다", () => {
    expect(reviewWriteDeadline(game)).toEqual(hours(3 + 7 * 24));
    expect(reviewWindowOf(game, hours(3 + 7 * 24 - 1))).toBe(REVIEW_WINDOW.open);
    expect(reviewWindowOf(game, hours(3 + 7 * 24))).toBe(REVIEW_WINDOW.closed);
  });

  it("일찍 마치면 마감도 당겨진다", () => {
    const early = { ...game, endedAt: hours(1) };
    expect(reviewWriteDeadline(early)).toEqual(hours(1 + 7 * 24));
  });

  it("일시가 없으면 열리지 않는다", () => {
    expect(reviewWindowOf({ ...game, confirmedAt: null }, hours(5))).toBe(REVIEW_WINDOW.notStarted);
    expect(reviewWriteDeadline({ ...game, confirmedAt: null })).toBeNull();
  });
});
