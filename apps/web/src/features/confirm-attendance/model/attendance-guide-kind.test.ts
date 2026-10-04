import { describe, expect, it } from "vitest";

import { ATTENDANCE_GUIDE, attendanceGuideKind } from "./attendance-guide-kind";
import { ATTENDANCE_PHASE } from "./attendance-phase";
import { attendancePhaseOf } from "./attendance-phase-of";

const DAY = 86_400_000;
const confirmedAt = new Date("2026-09-19T11:00:00Z");
const endedAt = new Date("2026-09-19T13:40:00Z");
const deadline = new Date(endedAt.getTime() + 7 * DAY);
const game = (attendanceConfirmedAt: Date | null) => ({
  attendanceConfirmedAt,
  confirmedAt,
  playMinutes: 180,
  endedAt,
});

describe("attendancePhaseOf", () => {
  const beforeDeadline = new Date(deadline.getTime() - 1);

  it("기한 전에는 확정 여부로 나뉜다(기한은 마친 시각 + 7일)", () => {
    expect(attendancePhaseOf({ game: game(null), now: beforeDeadline })).toBe(
      ATTENDANCE_PHASE.open,
    );
    expect(attendancePhaseOf({ game: game(endedAt), now: beforeDeadline })).toBe(
      ATTENDANCE_PHASE.confirmed,
    );
  });

  it("기한이 지나면 크론 전·자동 확정은 autoConfirmed, GM 확정은 closed다", () => {
    expect(attendancePhaseOf({ game: game(null), now: deadline })).toBe(
      ATTENDANCE_PHASE.autoConfirmed,
    );
    expect(attendancePhaseOf({ game: game(deadline), now: deadline })).toBe(
      ATTENDANCE_PHASE.autoConfirmed,
    );
    expect(attendancePhaseOf({ game: game(endedAt), now: deadline })).toBe(ATTENDANCE_PHASE.closed);
  });
});

describe("attendanceGuideKind", () => {
  it("확정 뒤는 다시 고치는 중인지로 나뉜다", () => {
    const phase = ATTENDANCE_PHASE.confirmed;
    expect(attendanceGuideKind({ phase, editing: false, expired: false })).toBe(
      ATTENDANCE_GUIDE.confirmed,
    );
    expect(attendanceGuideKind({ phase, editing: true, expired: false })).toBe(
      ATTENDANCE_GUIDE.reediting,
    );
  });

  it("다시 고치다 기한 거절을 받으면 직전 결과로 굳고, 새로고침 뒤(closed)에도 그대로다", () => {
    for (const phase of [ATTENDANCE_PHASE.confirmed, ATTENDANCE_PHASE.closed]) {
      expect(attendanceGuideKind({ phase, editing: false, expired: true })).toBe(
        ATTENDANCE_GUIDE.frozen,
      );
    }
    expect(
      attendanceGuideKind({ phase: ATTENDANCE_PHASE.open, editing: false, expired: true }),
    ).toBe(ATTENDANCE_GUIDE.autoConfirmed);
  });

  it("나머지 단계는 그대로 안내한다", () => {
    for (const phase of [
      ATTENDANCE_PHASE.open,
      ATTENDANCE_PHASE.autoConfirmed,
      ATTENDANCE_PHASE.closed,
    ]) {
      expect(attendanceGuideKind({ phase, editing: false, expired: false })).toBe(phase);
    }
  });
});
