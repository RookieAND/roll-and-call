import { describe, expect, it } from "vitest";

import { SCHEDULE_MODE } from "@/entities/game";

import { sessionTimeChanged } from "./session-time-change";

const at = new Date("2026-09-12T10:00:00.000Z");

describe("sessionTimeChanged", () => {
  it("같은 시각은 바뀜 없음", () => {
    expect(
      sessionTimeChanged({
        scheduleMode: SCHEDULE_MODE.fixed,
        previous: at,
        next: new Date(at.getTime()),
      }),
    ).toBe(false);
  });

  it("다른 시각은 밀리초 차이도 바뀜", () => {
    expect(
      sessionTimeChanged({
        scheduleMode: SCHEDULE_MODE.fixed,
        previous: at,
        next: new Date(at.getTime() + 1),
      }),
    ).toBe(true);
  });

  it("조율형은 늘 바뀜 없음", () => {
    expect(
      sessionTimeChanged({
        scheduleMode: SCHEDULE_MODE.coordinate,
        previous: at,
        next: new Date(at.getTime() + 60_000),
      }),
    ).toBe(false);
    expect(
      sessionTimeChanged({ scheduleMode: SCHEDULE_MODE.coordinate, previous: at, next: undefined }),
    ).toBe(false);
  });
});
