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

const byKey = (game: GameDetailData, responses: number) => {
  const [attendance, time, roster, edit] = manageRows(game, responses, NOW);
  return { attendance: attendance!, time: time!, roster: roster!, edit: edit! };
};

describe("manageRows", () => {
  it("줄은 네 개이고 순서가 고정이다", () => {
    expect(manageRows(coordinating, 0, NOW).map((row) => row.key)).toEqual([
      "attendance",
      "time",
      "roster",
      "edit",
    ]);
  });

  it("조율 중에는 출석 확인을 흐리게 두고 시간 확정으로 보낸다", () => {
    const rows = byKey(coordinating, 3);
    expect(rows.attendance.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.time.href).toBe("/games/game/confirm");
    expect(rows.roster.detail).toContain("1명 미제출");
  });

  it("기한이 지나면 시간 확정 줄에만 빨간 점을 단다", () => {
    const rows = byKey({ ...coordinating, endDate: new Date(NOW.getTime() - DAY) }, 3);
    expect(rows.time.blocked).toBe(true);
    expect(rows.roster.blocked).toBe(false);
  });

  it("세션이 끝나면 출석 확인만 남고 나머지는 닫힌다", () => {
    const rows = byKey({ ...coordinating, confirmedAt: new Date(NOW.getTime() - DAY) }, 4);
    expect(rows.attendance.blocked).toBe(true);
    expect(rows.time.state).toBe(MANAGE_ROW_STATE.done);
    expect(rows.roster.state).toBe(MANAGE_ROW_STATE.locked);
    expect(rows.edit.state).toBe(MANAGE_ROW_STATE.locked);
  });
});
