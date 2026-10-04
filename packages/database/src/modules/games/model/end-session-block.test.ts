import { describe, expect, it } from "vitest";

import { canEndSession } from "./can-end-session";
import { END_SESSION_BLOCK, endSessionBlock } from "./end-session-block";
import { UNDO_END_SESSION_BLOCK, undoEndSessionBlock } from "./undo-end-session-block";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const GM = "gm";
const start = new Date("2026-09-19T11:00:00Z");
const at = (offset: number) => new Date(start.getTime() + offset);
const game = (overrides: Partial<Parameters<typeof endSessionBlock>[0]["game"]> = {}) => ({
  gmId: GM,
  cancelledAt: null,
  confirmedAt: start,
  playMinutes: 120,
  endedAt: null,
  ...overrides,
});
const block = ({
  overrides,
  actorId = GM,
  confirmedCount = 3,
  now = at(MINUTE),
}: {
  overrides?: Partial<Parameters<typeof endSessionBlock>[0]["game"]>;
  actorId?: string;
  confirmedCount?: number;
  now?: Date;
}) => endSessionBlock({ game: game(overrides), actorId, confirmedCount, now });

describe("endSessionBlock", () => {
  it("GM이 아니면 막는다", () => {
    expect(block({ actorId: "other" })).toBe(END_SESSION_BLOCK.notGm);
  });

  it("취소된 구인은 막는다", () => {
    expect(block({ overrides: { cancelledAt: start } })).toBe(END_SESSION_BLOCK.cancelled);
  });

  it("시작 1초 전은 막고 시작 직후는 통과한다", () => {
    expect(block({ now: at(-SECOND) })).toBe(END_SESSION_BLOCK.notStarted);
    expect(block({ now: start })).toBeNull();
  });

  it("이미 마친 세션은 막는다", () => {
    expect(block({ overrides: { endedAt: at(MINUTE) }, now: at(2 * MINUTE) })).toBe(
      END_SESSION_BLOCK.alreadyEnded,
    );
  });

  it("예정 종료 직전은 통과하고 정각은 sessionOver다", () => {
    expect(block({ now: at(120 * MINUTE - SECOND) })).toBeNull();
    expect(block({ now: at(120 * MINUTE) })).toBe(END_SESSION_BLOCK.sessionOver);
  });

  it("플레이타임이 없으면 180분으로 본다", () => {
    expect(block({ overrides: { playMinutes: null }, now: at(179 * MINUTE) })).toBeNull();
    expect(block({ overrides: { playMinutes: null }, now: at(180 * MINUTE) })).toBe(
      END_SESSION_BLOCK.sessionOver,
    );
  });

  it("확정 참여자가 없으면 막는다", () => {
    expect(block({ confirmedCount: 0 })).toBe(END_SESSION_BLOCK.noConfirmed);
  });

  it("canEndSession은 GM이고 막힘이 없을 때만 true다", () => {
    expect(canEndSession({ game: game(), isGm: true, confirmedCount: 1, now: at(MINUTE) })).toBe(
      true,
    );
    expect(canEndSession({ game: game(), isGm: false, confirmedCount: 1, now: at(MINUTE) })).toBe(
      false,
    );
    expect(canEndSession({ game: game(), isGm: true, confirmedCount: 0, now: at(MINUTE) })).toBe(
      false,
    );
  });
});

describe("undoEndSessionBlock", () => {
  const endedAt = at(30 * MINUTE);
  const undo = ({
    overrides = {},
    actorId = GM,
    elapsed = SECOND,
  }: {
    overrides?: Partial<{ endedAt: Date | null; attendanceConfirmedAt: Date | null }>;
    actorId?: string;
    elapsed?: number;
  }) =>
    undoEndSessionBlock({
      game: { gmId: GM, endedAt, attendanceConfirmedAt: null, ...overrides },
      actorId,
      now: new Date(endedAt.getTime() + elapsed),
    });

  it("GM이 아니면 막는다", () => {
    expect(undo({ actorId: "other" })).toBe(UNDO_END_SESSION_BLOCK.notGm);
  });

  it("마치지 않은 세션은 막는다", () => {
    expect(undo({ overrides: { endedAt: null } })).toBe(UNDO_END_SESSION_BLOCK.notEnded);
  });

  it("출석을 확정했으면 막는다", () => {
    expect(undo({ overrides: { attendanceConfirmedAt: at(31 * MINUTE) } })).toBe(
      UNDO_END_SESSION_BLOCK.attendanceConfirmed,
    );
  });

  it("29초·30초는 통과하고 31초는 windowOver다", () => {
    expect(undo({ elapsed: 29 * SECOND })).toBeNull();
    expect(undo({ elapsed: 30 * SECOND })).toBeNull();
    expect(undo({ elapsed: 31 * SECOND })).toBe(UNDO_END_SESSION_BLOCK.windowOver);
  });
});
