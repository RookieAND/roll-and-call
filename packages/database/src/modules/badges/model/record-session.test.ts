import { describe, expect, it } from "vitest";

import { isRecordSession, type RecordGame } from "./record-session";

const START = new Date("2026-09-10T11:00:00Z");
const HOUR_MS = 3_600_000;
const at = (hours: number) => new Date(START.getTime() + hours * HOUR_MS);

type Participant = RecordGame["participants"][number];

const player = (userId: string, overrides: Partial<Participant> = {}): Participant => ({
  userId,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  ...overrides,
});

const game = (overrides: Partial<RecordGame> = {}): RecordGame => ({
  id: "g1",
  gmId: "gm",
  confirmedAt: START,
  playMinutes: 120,
  endedAt: null,
  hiddenAt: null,
  cancelledAt: null,
  participants: [player("p1")],
  ...overrides,
});

const isRecord = (target: RecordGame, now: Date) =>
  isRecordSession(
    {
      ...target,
      confirmedCount: target.participants.filter((row) => row.status === "confirmed").length,
    },
    now,
  );

describe("isRecordSession", () => {
  it("시작 시각 없음·숨김·취소·확정자 0명은 기록 세션이 아니다", () => {
    expect(isRecord(game({ confirmedAt: null }), at(10))).toBe(false);
    expect(isRecord(game({ hiddenAt: START }), at(10))).toBe(false);
    expect(isRecord(game({ cancelledAt: START }), at(10))).toBe(false);
    expect(isRecord(game({ participants: [] }), at(10))).toBe(false);
    expect(isRecord(game({ participants: [player("p1", { status: "waiting" })] }), at(10))).toBe(
      false,
    );
  });

  it("확정자가 removed 한 명뿐이면 기록 세션이 아니다", () => {
    expect(isRecord(game({ participants: [player("p1", { status: "removed" })] }), at(10))).toBe(
      false,
    );
  });

  it("ended_at이 없으면 시작 + 플레이타임이 지나야 기록 세션이다", () => {
    expect(isRecord(game(), at(1.9))).toBe(false);
    expect(isRecord(game(), at(2))).toBe(true);
  });

  it("ended_at이 있으면 그 시각이 지난 순간부터 기록 세션이다", () => {
    const early = game({ endedAt: at(0.5) });
    expect(isRecord(early, at(0.4))).toBe(false);
    expect(isRecord(early, at(0.5))).toBe(true);
  });

  it("출석 확인 전에도 기록 세션이다", () => {
    expect(isRecord(game({ participants: [player("p1", { absent: false })] }), at(3))).toBe(true);
  });
});
