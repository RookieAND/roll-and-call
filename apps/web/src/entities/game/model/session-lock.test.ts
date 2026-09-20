import { describe, expect, it } from "vitest";

import { SCHEDULE_MODE } from "./schedule-mode";
import { isSessionLocked } from "./session-lock";

const now = Date.parse("2026-09-14T00:00:00Z");
const future = new Date("2026-09-20T11:00:00Z");
const past = new Date("2026-09-10T11:00:00Z");

describe("isSessionLocked", () => {
  it("조율형은 시간이 정해지기 전까지 열려 있다", () => {
    expect(
      isSessionLocked({ scheduleMode: SCHEDULE_MODE.coordinate, confirmedAt: null, now }),
    ).toBe(false);
  });

  it("조율형은 GM이 확정하는 순간 잠긴다", () => {
    expect(
      isSessionLocked({ scheduleMode: SCHEDULE_MODE.coordinate, confirmedAt: future, now }),
    ).toBe(true);
  });

  it("일시 지정형은 세션 시각이 있어도 시작 전엔 열려 있다", () => {
    expect(isSessionLocked({ scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: future, now })).toBe(
      false,
    );
  });

  it("일시 지정형은 세션이 시작하면 잠긴다", () => {
    expect(isSessionLocked({ scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: past, now })).toBe(
      true,
    );
  });
});
