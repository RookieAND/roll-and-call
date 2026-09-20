import { describe, expect, it } from "vitest";

import { buildMonthRecord } from "./build-month-record";
import type { CalendarSession } from "./to-calendar-sessions";

function session(id: string, finished: boolean, gm: string, players: string[]): CalendarSession {
  return {
    id,
    title: id,
    rule: "CoC",
    startsAt: new Date("2026-09-10T11:00:00Z"),
    maxPlayers: 4,
    gm: { id: gm, username: gm, avatarUrl: null },
    players: players.map((player) => ({ id: player, username: player, avatarUrl: null })),
    mine: false,
    finished,
  };
}

describe("buildMonthRecord", () => {
  it("끝나지 않은 세션은 세지 않는다", () => {
    const record = buildMonthRecord([
      session("a", true, "gm1", ["p1"]),
      session("b", false, "gm1", ["p1", "p2"]),
    ]);

    expect(record.sessionCount).toBe(1);
    expect(record.gms.leaderCount).toBe(1);
    expect(record.players.leaders.map((person) => person.id)).toEqual(["p1"]);
  });

  it("끝난 세션이 없으면 비어 있다", () => {
    const record = buildMonthRecord([session("a", false, "gm1", ["p1"])]);

    expect(record.sessionCount).toBe(0);
    expect(record.gms.leaders).toEqual([]);
  });
});
