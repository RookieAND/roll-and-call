import { describe, expect, it } from "vitest";

import { roundScheduleProgress } from "./round-schedule-progress";

const dated = (roundNo: number, day: number, endedAt: Date | null = null) => ({
  roundNo,
  startAt: new Date(Date.UTC(2026, 11, day, 3)),
  plannedEndAt: new Date(Date.UTC(2026, 11, day, 7)),
  endedAt,
});
const pending = (roundNo: number) => ({
  roundNo,
  startAt: null,
  plannedEndAt: null,
  endedAt: null,
});

describe("roundScheduleProgress", () => {
  it("가장 앞 미정 회차와 가장 늦은 종료를 돌려준다", () => {
    expect(roundScheduleProgress([dated(1, 5), dated(2, 12), pending(4), pending(3)])).toEqual({
      nextUnscheduledRoundNo: 3,
      lastRoundEndAt: new Date(Date.UTC(2026, 11, 12, 7)),
    });
  });

  it("마친 시각이 있으면 예정 종료 대신 쓰고, 미정이 없으면 null이다", () => {
    const endedAt = new Date(Date.UTC(2026, 11, 5, 5));
    expect(roundScheduleProgress([dated(1, 5, endedAt)])).toEqual({
      nextUnscheduledRoundNo: null,
      lastRoundEndAt: endedAt,
    });
  });
});
