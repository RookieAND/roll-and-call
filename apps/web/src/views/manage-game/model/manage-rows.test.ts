import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS, SCHEDULE_MODE } from "@/entities/game";
import type { GameDetailData } from "@/shared/server";

import { MANAGE_ROW_STATE, manageRows } from "./manage-rows";

const NOW = new Date("2026-09-20T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;

const member = (userId: string) => ({
  userId,
  joinedAt: NOW,
  status: PARTICIPANT_STATUS.confirmed,
});

const coordinating = {
  id: "game",
  scheduleMode: SCHEDULE_MODE.coordinate,
  confirmedAt: null,
  playMinutes: 60,
  attendanceConfirmedAt: null,
  endDate: new Date(NOW.getTime() + 2 * DAY),
  maxPlayers: 4,
  participants: ["a", "b", "c", "d"].map(member),
} as unknown as GameDetailData;

const byKey = (game: GameDetailData) => {
  const [attendance, time, roster, edit] = manageRows(game, NOW);
  return { attendance: attendance!, time: time!, roster: roster!, edit: edit! };
};

describe("manageRows", () => {
  it("줄은 네 개이고 순서가 고정이다", () => {
    expect(manageRows(coordinating, NOW).map((row) => row.key)).toEqual([
      "attendance",
      "time",
      "roster",
      "edit",
    ]);
  });

  it("조율 중에는 출석 확인을 흐리게 두고 시간 정하기로 보낸다", () => {
    const rows = byKey(coordinating);
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.time.href).toBe("/games/game/confirm");
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.open);
  });

  it("기한이 지나면 시간 정하기 줄만 붉게 막힌다", () => {
    const rows = byKey({ ...coordinating, endDate: new Date(NOW.getTime() - DAY) });
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.blocked);
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.open);
  });

  it("세션이 끝나면 출석 확인만 남고 나머지는 닫힌다", () => {
    const rows = byKey({ ...coordinating, confirmedAt: new Date(NOW.getTime() - DAY) });
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.open);
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.done);
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.edit.state).toBe(MANAGE_ROW_STATE.locked);
  });
});
