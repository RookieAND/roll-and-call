import { describe, expect, it } from "vitest";

import type { MonthSessionRow } from "@/shared/server";

import { toCalendarSessions } from "./to-calendar-sessions";

const DEADLINE = new Date("2026-09-09T00:00:00Z");
const START = new Date("2026-09-10T11:00:00Z");
const BEFORE_DEADLINE = new Date("2026-09-08T00:00:00Z");
const BEFORE_START = new Date("2026-09-09T12:00:00Z");
const AFTER_END = new Date("2026-09-20T00:00:00Z");

const person = (id: string) => ({ id, username: id, avatarUrl: null });

const row = (overrides: Partial<MonthSessionRow> = {}) =>
  ({
    id: "game",
    title: "세션",
    rule: "CoC 7th",
    gmId: "gm",
    gm: person("gm"),
    scheduleMode: "fixed",
    confirmedAt: START,
    endDate: DEADLINE,
    playMinutes: 120,
    endedAt: null,
    maxPlayers: 4,
    cancelledAt: null,
    participants: [],
    ...overrides,
  }) as MonthSessionRow;

const confirmed = (id: string): MonthSessionRow["participants"][number] => ({
  userId: id,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  user: person(id),
});

const ids = (rows: MonthSessionRow[], now: Date) =>
  toCalendarSessions({ rows, viewerId: null, now }).map((session) => session.id);

describe("toCalendarSessions", () => {
  it("일시 지정형이 확정자 없이 마감되면 세션 전·후 모두 뺀다", () => {
    expect(ids([row()], BEFORE_START)).toEqual([]);
    expect(ids([row()], AFTER_END)).toEqual([]);
  });

  it("마감 전 모집 중인 일시 지정형은 확정자가 없어도 올린다", () => {
    expect(ids([row()], BEFORE_DEADLINE)).toEqual(["game"]);
  });

  it("확정자가 있으면 마감 뒤에도 남는다", () => {
    expect(ids([row({ participants: [confirmed("p1")] })], AFTER_END)).toEqual(["game"]);
  });

  it("조율형은 시작 시각이 있으면 확정자 수와 상관없이 올린다", () => {
    expect(ids([row({ scheduleMode: "coordinate" })], AFTER_END)).toEqual(["game"]);
  });

  it("시작 시각이 없으면 뺀다", () => {
    expect(ids([row({ confirmedAt: null })], BEFORE_DEADLINE)).toEqual([]);
  });

  it("취소된 구인은 뺀다", () => {
    expect(ids([row({ cancelledAt: BEFORE_START })], AFTER_END)).toEqual([]);
  });
});
