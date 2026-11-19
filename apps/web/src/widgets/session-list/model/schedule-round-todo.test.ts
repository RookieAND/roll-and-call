import { describe, expect, it } from "vitest";

import type { SessionGame } from "@/entities/game";

import { scheduleRoundTodo } from "./schedule-round-todo";

const DAY = 86_400_000;
const lastEnd = new Date("2026-12-05T07:00:00Z");

function gameOf(extra: Partial<SessionGame> = {}) {
  return {
    id: "g1",
    title: "캠페인",
    roundCount: 4,
    roundScheduleKind: "coordinated",
    finishedAt: null,
    nextUnscheduledRoundNo: 3,
    lastRoundEndAt: lastEnd,
    ...extra,
  } as SessionGame;
}

describe("scheduleRoundTodo", () => {
  it("마지막 회차가 끝난 뒤 다음 회차 일정을 잡으라고 한다", () => {
    expect(scheduleRoundTodo({ game: gameOf(), now: new Date(+lastEnd + DAY) })).toMatchObject({
      label: "3회차 일정을 잡아 주세요",
      href: "/games/g1/rounds/3/schedule",
      blocked: false,
      lines: ["캠페인"],
    });
  });

  it("자동 마침까지 7일 남았으면 경고하고 8일이면 아니다", () => {
    const sevenLeft = new Date(+lastEnd + 23 * DAY);
    expect(scheduleRoundTodo({ game: gameOf(), now: sevenLeft })).toMatchObject({
      blocked: true,
      lines: ["캠페인", "정하지 않으면 7일 뒤 자동으로 마칩니다."],
    });
    const eightLeft = new Date(+lastEnd + 22 * DAY);
    expect(scheduleRoundTodo({ game: gameOf(), now: eightLeft })?.blocked).toBe(false);
  });

  it("다음 회차가 남았거나 끝난 구인, 지정형, 단발은 할 일이 없다", () => {
    const now = new Date(+lastEnd + DAY);
    expect(scheduleRoundTodo({ game: gameOf(), now: new Date(+lastEnd - DAY) })).toBeNull();
    expect(scheduleRoundTodo({ game: gameOf({ finishedAt: now }), now })).toBeNull();
    expect(
      scheduleRoundTodo({ game: gameOf({ roundScheduleKind: "designated" }), now }),
    ).toBeNull();
    expect(scheduleRoundTodo({ game: gameOf({ nextUnscheduledRoundNo: null }), now })).toBeNull();
    expect(scheduleRoundTodo({ game: gameOf({ roundCount: 1 }), now })).toBeNull();
  });
});
