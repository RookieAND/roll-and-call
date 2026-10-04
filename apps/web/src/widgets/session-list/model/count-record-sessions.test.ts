import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS, type ParticipantStatus } from "@/entities/game";

import { countRecordSessions } from "./count-record-sessions";
import type { SessionGame } from "./session-card-model";

const NOW = new Date("2026-09-15T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(NOW.getTime() + days * DAY);

const seat = ({
  userId,
  status = PARTICIPANT_STATUS.confirmed,
  absent = false,
}: {
  userId: string;
  status?: ParticipantStatus;
  absent?: boolean;
}) => ({
  userId,
  status,
  joinedAt: at(-10),
  absent,
});

function game(partial: Partial<SessionGame>): SessionGame {
  return {
    id: "g",
    gmId: "me",
    confirmedAt: at(-2),
    playMinutes: 180,
    endedAt: null,
    hiddenAt: null,
    cancelledAt: null,
    participants: [seat({ userId: "me" }), seat({ userId: "other" })],
    ...partial,
  } as unknown as SessionGame;
}

const hostedCount = (games: SessionGame[]) =>
  countRecordSessions({ hosted: games, joined: [], userId: "me", now: NOW }).hosted;
const playedCount = (games: SessionGame[]) =>
  countRecordSessions({ hosted: [], joined: games, userId: "me", now: NOW }).played;

describe("countRecordSessions", () => {
  it("끝난 세션은 출석 확인 전이어도 센다", () => {
    expect(hostedCount([game({})])).toBe(1);
  });

  it("모집·조율 중, 아직 안 끝난 세션, 무산, 숨김, 취소는 세지 않는다", () => {
    expect(
      hostedCount([
        game({ confirmedAt: null }),
        game({ confirmedAt: at(1) }),
        game({ confirmedAt: new Date(NOW.getTime() - 60 * 60 * 1000) }),
        game({ participants: [] }),
        game({ hiddenAt: at(-1) }),
        game({ cancelledAt: at(-3) }),
      ]),
    ).toBe(0);
  });

  it("참여는 불참·내보낸 사람·대기를 빼고, 운영진이 취소한 불참(absent false로 접힘)은 센다", () => {
    expect(
      playedCount([
        game({}),
        game({ participants: [seat({ userId: "me", absent: true }), seat({ userId: "other" })] }),
        game({
          participants: [
            seat({ userId: "me", status: PARTICIPANT_STATUS.removed, absent: true }),
            seat({ userId: "other" }),
          ],
        }),
        game({
          participants: [
            seat({ userId: "me", status: PARTICIPANT_STATUS.waiting }),
            seat({ userId: "other" }),
          ],
        }),
      ]),
    ).toBe(1);
  });
});
