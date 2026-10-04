import { describe, expect, it } from "vitest";

import type { Game } from "#/schema";

import { kickImpactOf } from "./kick-impact-of";
import { pickMemberOngoing } from "./member-ongoing";

const now = new Date("2026-10-05T12:00:00Z");
const later = new Date("2026-10-10T12:00:00Z");
const earlier = new Date("2026-10-01T12:00:00Z");

const game = (id: string, changes: Partial<Game> = {}) =>
  ({
    id,
    title: id,
    gmId: "gm",
    maxPlayers: 4,
    endDate: later,
    confirmedAt: null,
    cancelledAt: null,
    recruitMethod: "first_come",
    drawnAt: null,
    ...changes,
    gmNickname: "GM",
  }) as Game & { gmNickname: string };

const games = [
  game("모집 중", { gmId: "me" }),
  game("모집 마감", { gmId: "me", endDate: earlier }),
  game("일정 확정", { gmId: "me", confirmedAt: later }),
  game("시간 미정", { gmId: "me", confirmedAt: null }),
  game("시작한 GM 세션", { gmId: "me", confirmedAt: earlier }),
  game("취소된 GM 구인", { gmId: "me", cancelledAt: earlier }),
  game("확정 참여", { confirmedAt: later }),
  game("대기 신청"),
  game("추첨 전 신청", { recruitMethod: "lottery" }),
  game("시작한 참여", { confirmedAt: earlier }),
  game("취소된 참여", { cancelledAt: earlier }),
  game("내보낸 참여"),
];
const roster = [
  { gameId: "모집 중", userId: "a", status: "confirmed" as const },
  { gameId: "모집 중", userId: "b", status: "waiting" as const },
  { gameId: "모집 중", userId: "c", status: "removed" as const },
  { gameId: "확정 참여", userId: "me", status: "confirmed" as const },
  { gameId: "대기 신청", userId: "me", status: "waiting" as const },
  { gameId: "추첨 전 신청", userId: "me", status: "confirmed" as const },
  { gameId: "시작한 참여", userId: "me", status: "confirmed" as const },
  { gameId: "취소된 참여", userId: "me", status: "confirmed" as const },
  { gameId: "내보낸 참여", userId: "me", status: "removed" as const },
];

describe("pickMemberOngoing", () => {
  const ongoing = pickMemberOngoing({ userId: "me", games, roster, now });

  it("시작 전 GM 구인과 확정·대기 참여만 넣고, 시작한 세션·취소된 구인·내보낸 참여는 뺀다", () => {
    expect(Object.fromEntries(ongoing.map((item) => [item.game.id, item.role]))).toEqual({
      "모집 중": "gm",
      "모집 마감": "gm",
      "일정 확정": "gm",
      "시간 미정": "gm",
      "확정 참여": "confirmed",
      "대기 신청": "waiting",
      "추첨 전 신청": "confirmed",
    });
  });

  it("GM 구인의 알림 받는 사람은 확정자·대기자이고 당사자와 내보낸 사람은 빠진다", () => {
    const hosted = ongoing.find((item) => item.game.id === "모집 중")!;
    expect(hosted.confirmedCount).toBe(1);
    expect(hosted.notifiedCount).toBe(2);
  });

  it("추방 영향은 같은 목록을 센다", () => {
    expect(kickImpactOf(ongoing)).toEqual({
      appliedCount: 1,
      waitingCount: 1,
      confirmedCount: 1,
      cancelledGameCount: 4,
    });
  });
});
