import { describe, expect, it } from "vitest";

import { countRecordSessions } from "./count-record-sessions";
import { PARTICIPANT_STATUS, type ParticipantStatus } from "./participant";
import type { SessionGame } from "./session-game";

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

describe("countRecordSessions · includeInProgress", () => {
  const count = (games: SessionGame[]) =>
    countRecordSessions({
      hosted: games,
      joined: games,
      userId: "me",
      now: NOW,
      includeInProgress: true,
    });
  const running = { confirmedAt: new Date(NOW.getTime() - 60 * 60 * 1000) };

  it("시작했지만 끝나지 않은 세션은 세고 취소된 구인은 뺀다", () => {
    expect(count([game(running)])).toEqual({ hosted: 1, played: 1 });
    expect(count([game({ ...running, cancelledAt: at(-1) })])).toEqual({ hosted: 0, played: 0 });
  });

  it("시작 전 세션과 대기는 세지 않는다", () => {
    const waiting = game({
      ...running,
      participants: [seat({ userId: "me", status: PARTICIPANT_STATUS.waiting })],
    });
    expect(count([game({ confirmedAt: at(1) }), game({ confirmedAt: null }), waiting])).toEqual({
      hosted: 1,
      played: 0,
    });
  });

  describe("다회차", () => {
    const multi = (attendedRoundCount: number, partial = {}) =>
      game({
        roundCount: 4,
        attendedRoundCount,
        finishedAt: null,
        participants: [seat({ userId: "me" })],
        ...partial,
      } as Partial<SessionGame>);

    it("구인이 끝나지 않아도 참석한 회차마다 하나로 센다", () => {
      expect(playedCount([multi(4)])).toBe(4);
      expect(playedCount([multi(0)])).toBe(0);
    });

    it("2회차 참석 뒤 내보내거나 상호 하차해도 참석한 2회차는 남는다", () => {
      expect(
        playedCount([
          multi(2, {
            participants: [
              {
                ...seat({ userId: "me" }),
                status: PARTICIPANT_STATUS.removed,
                absent: true,
                leftReason: "removed",
              },
            ],
          }),
        ]),
      ).toBe(2);
      expect(
        playedCount([
          multi(2, { participants: [{ ...seat({ userId: "me" }), leftReason: "mutual" }] }),
        ]),
      ).toBe(2);
    });

    it("취소·숨김 구인은 세지 않고 여러 구인은 합친다", () => {
      expect(playedCount([multi(3, { cancelledAt: at(-1) })])).toBe(0);
      expect(playedCount([multi(3, { hiddenAt: at(-1) })])).toBe(0);
      expect(playedCount([multi(3), multi(1)])).toBe(4);
    });
  });
});
