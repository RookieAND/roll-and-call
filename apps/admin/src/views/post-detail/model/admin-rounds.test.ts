import { describe, expect, it } from "vitest";

import type { AdminRound } from "./admin-rounds";
import { finishedRoundCount } from "./finished-round-count";
import { roundAttendanceLabel } from "./round-attendance-label";
import { roundEarlyEndText } from "./round-early-end-text";
import { roundSkipText } from "./round-skip-text";
import { roundStatusOf } from "./round-status";
import { roundTimeText } from "./round-time-text";

const HOUR = 3_600_000;
// 2026-10-24 12:00 KST
const START = new Date("2026-10-24T03:00:00Z");
const NOW = new Date(START.getTime() + 10 * HOUR);

function round(overrides: Partial<AdminRound> = {}): AdminRound {
  return {
    roundNo: 1,
    status: "scheduled",
    startAt: START,
    plannedEndAt: new Date(START.getTime() + 4 * HOUR),
    endedAt: null,
    attendanceConfirmedAt: null,
    attendees: [],
    ...overrides,
  };
}

describe("회차 상태", () => {
  it("시각으로 일정 정해짐·진행 중·끝남을 가른다", () => {
    expect(roundStatusOf({ round: round(), now: new Date(START.getTime() - HOUR) })).toBe(
      "upcoming",
    );
    expect(roundStatusOf({ round: round(), now: new Date(START.getTime() + HOUR) })).toBe("live");
    expect(roundStatusOf({ round: round({ status: "in_progress" }), now: NOW })).toBe("ended");
  });

  it("일정이 없거나 조율 중이거나 취소 중이면 저장된 상태를 따른다", () => {
    const empty = { startAt: null, plannedEndAt: null };
    expect(roundStatusOf({ round: round({ ...empty, status: "unscheduled" }), now: NOW })).toBe(
      "none",
    );
    expect(roundStatusOf({ round: round({ ...empty, status: "coordinating" }), now: NOW })).toBe(
      "coordinating",
    );
    expect(roundStatusOf({ round: round({ status: "cancelling" }), now: NOW })).toBe("cancelling");
  });

  it("일찍 마친 회차는 끝남이고 마침 수에 든다", () => {
    const early = round({ endedAt: new Date(START.getTime() + HOUR) });
    const rounds = [early, round({ startAt: null, plannedEndAt: null, status: "unscheduled" })];
    expect(finishedRoundCount({ rounds, now: new Date(START.getTime() + 2 * HOUR) })).toBe(1);
  });
});

describe("회차 표시 글", () => {
  it("일시와 일찍 마침 문구를 만든다", () => {
    expect(roundTimeText(round())).toBe("10월 24일 (토) 오후 12:00~4:00");
    expect(roundTimeText(round({ startAt: null, plannedEndAt: null }))).toBeNull();
    expect(roundEarlyEndText(round())).toBeNull();
    expect(roundEarlyEndText(round({ endedAt: new Date(START.getTime() + 3.67 * HOUR) }))).toBe(
      "오후 3:40 종료",
    );
  });

  it("출석은 확정하고 끝난 회차만 보인다", () => {
    const attendees = [
      { userId: "a", nickname: "a", attended: true },
      { userId: "b", nickname: "b", attended: false },
    ];
    const confirmed = round({ attendanceConfirmedAt: NOW, attendees });
    expect(roundAttendanceLabel({ round: confirmed, now: NOW })).toBe("1/2명");
    expect(roundAttendanceLabel({ round: round({ attendees }), now: NOW })).toBeNull();
    expect(
      roundAttendanceLabel({ round: confirmed, now: new Date(START.getTime() + HOUR) }),
    ).toBeNull();
  });

  it("생략 기록 한 줄을 만든다", () => {
    expect(
      roundSkipText({
        roundNo: 2,
        originalStartAt: START,
        originalPlannedEndAt: new Date(START.getTime() + 4 * HOUR),
        skippedAt: new Date("2026-10-25T00:12:00Z"),
      }),
    ).toBe("10월 24일 (토) 오후 12:00 · 10월 25일 오전 9:12에 생략");
  });
});
