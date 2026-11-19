import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS } from "./participant";
import { recentAbsences } from "./recent-absences";
import type { SessionGame } from "./session-game";

const NOW = new Date("2026-10-03T12:00:00+09:00");
const DAY = 86_400_000;

function absentGame(id: string, startsAt: Date): SessionGame {
  return {
    id,
    title: id,
    confirmedAt: startsAt,
    attendanceConfirmedAt: startsAt,
    participants: [
      { userId: "me", status: PARTICIPANT_STATUS.confirmed, joinedAt: startsAt, absent: true },
    ],
  } as unknown as SessionGame;
}

describe("recentAbsences", () => {
  it("세션 시작부터 30일 안의 불참만 남긴다", () => {
    const joined = [
      absentGame("inside", new Date(NOW.getTime() - 30 * DAY + 1)),
      absentGame("outside", new Date(NOW.getTime() - 30 * DAY)),
    ];
    expect(
      recentAbsences({ joined, userId: "me", now: NOW }).map((absence) => absence.gameId),
    ).toEqual(["inside"]);
  });

  describe("다회차", () => {
    const multi = (participant: Record<string, unknown>): SessionGame =>
      ({
        id: "multi",
        title: "multi",
        roundCount: 4,
        confirmedAt: new Date(NOW.getTime() - 60 * DAY),
        attendanceConfirmedAt: null,
        participants: [
          {
            userId: "me",
            status: PARTICIPANT_STATUS.confirmed,
            joinedAt: NOW,
            absent: false,
            ...participant,
          },
        ],
      }) as unknown as SessionGame;

    it("회차를 놓치고 남은 사람은 불참이 없다", () => {
      expect(recentAbsences({ joined: [multi({})], userId: "me", now: NOW })).toEqual([]);
    });

    it("불참으로 내보내면 1건이고 30일은 absenceAt부터 센다", () => {
      const absenceAt = new Date(NOW.getTime() - 10 * DAY);
      const kicked = multi({
        status: PARTICIPANT_STATUS.removed,
        absent: true,
        leftReason: "removed",
        absenceAt,
      });
      const [absence] = recentAbsences({ joined: [kicked], userId: "me", now: NOW });
      expect(absence?.sessionAt).toEqual(absenceAt);
      expect(absence?.expiresAt.getTime()).toBe(absenceAt.getTime() + 30 * DAY);
    });
  });
});
