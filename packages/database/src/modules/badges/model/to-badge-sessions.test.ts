import { describe, expect, it } from "vitest";

import { toBadgeSessions } from "./to-badge-sessions";

const START = new Date("2026-09-10T11:00:00Z");
const row = (gameId: string, attendedCount: number) => ({
  gameId,
  title: gameId,
  confirmedAt: START,
  playMinutes: 120,
  endedAt: null,
  attendanceConfirmedAt: START,
  hiddenAt: null,
  cancelledAt: null,
  categoryId: null,
  categoryName: null,
  attendedCount,
});

describe("toBadgeSessions", () => {
  it("타이만(참석 1명)은 업적에서 빼고 미니룰·정식은 센다", () => {
    const sessions = toBadgeSessions(
      [row("tie", 1), row("duo", 2), row("full", 4)],
      new Date("2026-09-20T00:00:00Z"),
    );
    expect(sessions.map((session) => session.gameId)).toEqual(["duo", "full"]);
  });
});
