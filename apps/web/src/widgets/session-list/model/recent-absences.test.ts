import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS } from "@/entities/game";

import { recentAbsences } from "./recent-absences";
import type { SessionGame } from "./session-card-model";

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
});
