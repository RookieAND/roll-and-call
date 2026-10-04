import { describe, expect, it } from "vitest";

import { isStartInCoordinationRange } from "./coordination-range";

const range = { rangeStart: "2026-09-16", rangeEnd: "2026-09-19" };
const LATE = { startHour: 22, endHour: 2 };
const NOON = { startHour: 12, endHour: 0 };

// KST 벽시계 → UTC
function kst(value: string) {
  return new Date(`${value}+09:00`);
}

describe("isStartInCoordinationRange", () => {
  it("첫날 0시와 마지막 날 23:30은 안이다", () => {
    expect(
      isStartInCoordinationRange({ startsAt: kst("2026-09-16T00:00"), ...range, window: NOON }),
    ).toBe(true);
    expect(
      isStartInCoordinationRange({ startsAt: kst("2026-09-19T23:30"), ...range, window: NOON }),
    ).toBe(true);
  });

  it("마지막 날 다음 날 01:00은 22~2면 안, 12~0이면 밖이다", () => {
    const startsAt = kst("2026-09-20T01:00");
    expect(isStartInCoordinationRange({ startsAt, ...range, window: LATE })).toBe(true);
    expect(isStartInCoordinationRange({ startsAt, ...range, window: NOON })).toBe(false);
  });

  it("마지막 날 다음 날이라도 끝 시각 뒤면 밖이다", () => {
    expect(
      isStartInCoordinationRange({ startsAt: kst("2026-09-20T02:00"), ...range, window: LATE }),
    ).toBe(false);
  });

  it("첫날 전날은 밖이다", () => {
    expect(
      isStartInCoordinationRange({ startsAt: kst("2026-09-15T23:30"), ...range, window: LATE }),
    ).toBe(false);
  });

  it("시간대 밖 시각도 날짜만 맞으면 안이다", () => {
    expect(
      isStartInCoordinationRange({ startsAt: kst("2026-09-17T09:00"), ...range, window: LATE }),
    ).toBe(true);
  });
});
