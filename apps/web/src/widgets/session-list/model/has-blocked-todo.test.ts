import { describe, expect, it } from "vitest";

import {
  PARTICIPANT_STATUS,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  SESSION_ROLE,
  type SessionGame,
} from "@/entities/game";

import { hasBlockedTodo } from "./has-blocked-todo";
import { toSessionCard } from "./to-session-card";

const NOW = new Date("2026-09-15T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(NOW.getTime() + days * DAY);

function game(partial: Partial<SessionGame>): SessionGame {
  return {
    id: "g",
    gmId: "gm",
    visibility: "public",
    title: "제목",
    rule: "CoC",
    maxPlayers: 4,
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    endDate: at(-1),
    rangeStart: "2026-09-20",
    rangeEnd: "2026-09-24",
    waitlistEnabled: true,
    recruitMethod: RECRUIT_METHOD.firstCome,
    drawnAt: null,
    playMinutes: 180,
    attendanceConfirmedAt: null,
    endedAt: null,
    cancelledAt: null,
    gm: { username: "한랑아", avatarUrl: null },
    participants: [
      { userId: "a", status: PARTICIPANT_STATUS.confirmed, joinedAt: at(-10), absent: false },
    ],
    ...partial,
  } as unknown as SessionGame;
}

describe("hasBlockedTodo", () => {
  it("조율 기한이 지났는데 시간을 안 정한 GM 구인이 있으면 막힌 할 일이다", () => {
    expect(hasBlockedTodo({ hosted: [game({})], viewerId: "gm", now: NOW })).toBe(true);
  });

  it("시간을 정했거나 취소된 구인은 막힌 할 일이 아니다", () => {
    const hosted = [game({ confirmedAt: at(5) }), game({ id: "c", cancelledAt: at(-1) })];
    expect(hasBlockedTodo({ hosted, viewerId: "gm", now: NOW })).toBe(false);
  });

  // 참여 카드에서 막힌 할 일이 생기면 loadBlockedTodo가 참여 구인도 읽어야 한다.
  it("참여 카드의 할 일은 막히지 않는다", () => {
    const card = toSessionCard({
      game: game({
        endDate: at(3),
        participants: [
          { userId: "me", status: PARTICIPANT_STATUS.confirmed, joinedAt: at(-1), absent: false },
        ],
      }),
      role: SESSION_ROLE.player,
      context: { viewerId: "me", respondedGameIds: new Set(), responseCounts: new Map(), now: NOW },
    });
    expect(card.todo).not.toBeNull();
    expect(card.todo?.blocked).toBe(false);
  });
});
