import { describe, expect, it } from "vitest";

import { roundTimeError } from "./round-time-error";

const HOUR = 3_600_000;
const now = new Date("2026-12-01T00:00:00Z");
const startsAt = new Date("2026-12-10T10:00:00Z");
const endsAt = new Date(startsAt.getTime() + 4 * HOUR);
const base = { previousRound: undefined, nextRound: undefined, startsAt, endsAt, now };

describe("회차 일시 오류", () => {
  it("문제없으면 null", () => expect(roundTimeError(base)).toBeNull());

  it("종료가 시작보다 뒤여야 한다", () => {
    expect(roundTimeError({ ...base, endsAt: startsAt })).toBe(
      "종료 시각은 시작 시각보다 뒤여야 합니다.",
    );
  });

  it("24시간을 넘을 수 없다", () => {
    expect(roundTimeError({ ...base, endsAt: new Date(startsAt.getTime() + 25 * HOUR) })).toBe(
      "한 회차는 24시간을 넘을 수 없습니다.",
    );
  });

  it("지난 시각은 안 된다", () => {
    expect(roundTimeError({ ...base, now: new Date(startsAt.getTime() + 1) })).toBe(
      "지난 시각으로는 정할 수 없습니다.",
    );
  });

  it("앞 회차와 겹치면 안 된다", () => {
    const previousRound = { plannedEndAt: new Date(startsAt.getTime() + HOUR), endedAt: null };
    expect(roundTimeError({ ...base, previousRound })).toBe("앞 회차와 시간이 겹칩니다.");
  });

  it("뒤 회차와 겹치면 안 된다", () => {
    const nextRound = { startAt: new Date(endsAt.getTime() - HOUR) };
    expect(roundTimeError({ ...base, nextRound })).toBe("뒤 회차와 시간이 겹칩니다.");
  });
});
