import type { GameDetailData } from "@roll-and-call/database/games";
import { describe, expect, it } from "vitest";

import { SCHEDULE_MODE } from "@/entities/game";

import { manageTimeline, TIMELINE_STATE } from "./manage-timeline";

const NOW = new Date("2026-09-20T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;

const base = {
  id: "game",
  scheduleMode: SCHEDULE_MODE.fixed,
  cancelledAt: null,
  confirmedAt: null,
  playMinutes: 60,
  endedAt: null,
  attendanceConfirmedAt: null,
  endDate: new Date(NOW.getTime() + 86400000),
  participants: [],
} as unknown as GameDetailData;

const withGame = (patch: Record<string, unknown>) => ({ ...base, ...patch }) as GameDetailData;

describe("manageTimeline", () => {
  it("일시를 정하기 전에는 시작 전이 현재 단계다", () => {
    const steps = manageTimeline({ game: base, now: NOW });
    expect(steps.map((step) => step.state)).toEqual([
      TIMELINE_STATE.current,
      TIMELINE_STATE.todo,
      TIMELINE_STATE.todo,
    ]);
    expect(steps[0]?.detail).toBe("세션 일시 미정");
  });

  it("진행 중이면 진행 단계가 현재이고 예정 종료를 보인다", () => {
    const steps = manageTimeline({
      game: withGame({ confirmedAt: new Date(NOW.getTime() - HOUR / 2) }),
      now: NOW,
    });
    expect(steps.map((step) => step.state)).toEqual([
      TIMELINE_STATE.done,
      TIMELINE_STATE.current,
      TIMELINE_STATE.todo,
    ]);
    expect(steps[1]?.detail?.startsWith("예정 종료 ")).toBe(true);
  });

  it("끝나면 종료 후가 현재이고 출석 값을 붙인다", () => {
    const steps = manageTimeline({
      game: withGame({
        confirmedAt: new Date(NOW.getTime() - 5 * HOUR),
        endedAt: new Date(NOW.getTime() - HOUR),
      }),
      attendance: "3 / 4명",
      now: NOW,
    });
    expect(steps.map((step) => step.state)).toEqual([
      TIMELINE_STATE.done,
      TIMELINE_STATE.done,
      TIMELINE_STATE.current,
    ]);
    expect(steps[2]?.detail).toBe("출석 3 / 4명");
  });
});
