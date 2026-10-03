import { describe, expect, it } from "vitest";

import { absenceExpiresAt, isAbsenceActive } from "./absence-window";

const startsAt = new Date("2026-09-19T11:00:00Z");
const DAY = 86_400_000;

describe("absenceExpiresAt", () => {
  it("세션 시작 30×24시간 뒤에 끝난다", () => {
    expect(absenceExpiresAt(startsAt).toISOString()).toBe("2026-10-19T11:00:00.000Z");
  });

  it("문자열 시각도 받는다", () => {
    expect(absenceExpiresAt("2026-09-19T20:00:00+09:00").toISOString()).toBe(
      "2026-10-19T11:00:00.000Z",
    );
  });
});

describe("isAbsenceActive", () => {
  it("30일 직전까지는 남아 있다", () => {
    expect(
      isAbsenceActive({ sessionStartsAt: startsAt, now: startsAt.getTime() + 30 * DAY - 1 }),
    ).toBe(true);
  });

  it("30일이 되면 사라진다", () => {
    expect(isAbsenceActive({ sessionStartsAt: startsAt, now: startsAt.getTime() + 30 * DAY })).toBe(
      false,
    );
  });
});
