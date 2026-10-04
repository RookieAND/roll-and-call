import { GAME_STATUS } from "@roll-and-call/database/games/model";
import { describe, expect, it } from "vitest";

import { OG_IMAGE } from "@/shared/lib";

import { pastGameCardView } from "./past-game-card-view";

const now = new Date("2026-10-05T12:00:00+09:00");

type PastGame = Parameters<typeof pastGameCardView>[0];

function pastGame(fields: Partial<PastGame>): PastGame {
  return {
    rule: "CoC 7th",
    maxPlayers: 4,
    endDate: new Date("2026-09-12T12:00:00+09:00"),
    waitlistEnabled: true,
    scheduleMode: "coordinate",
    confirmedAt: null,
    playMinutes: null,
    endedAt: null,
    cancelledAt: null,
    thumbnailUrl: null,
    thumbnailSpoiler: false,
    participants: [],
    ...fields,
  } as PastGame;
}

describe("pastGameCardView", () => {
  it("세션이 끝난 구인도 취소됐으면 「종료」가 아니라 「취소됨」이고 취소한 날을 적는다", () => {
    const view = pastGameCardView(
      pastGame({
        scheduleMode: "fixed",
        confirmedAt: new Date("2026-09-20T20:00:00+09:00"),
        cancelledAt: new Date("2026-09-10T09:00:00+09:00"),
      }),
      now,
    );
    expect(view.grayBadge).toBe("취소됨");
    expect(view.meta).toBe("CoC 7th · 9월 10일 취소");
  });

  it("세션이 끝났으면 「종료」, 아니면 구인 상태 배지", () => {
    const ended = pastGameCardView(
      pastGame({
        scheduleMode: "fixed",
        confirmedAt: new Date("2026-08-03T20:00:00+09:00"),
        participants: [{ userId: "a", status: "confirmed" }],
      }),
      now,
    );
    expect(ended.grayBadge).toBe("종료");
    expect(ended.meta).toBe("CoC 7th · 8월 3일 세션 · 1명");

    const closed = pastGameCardView(pastGame({}), now);
    expect(closed.grayBadge).toBeNull();
    expect(closed.status).toBe(GAME_STATUS.closed);
    expect(closed.meta).toBe("CoC 7th · 9월 12일 마감");
  });

  it("썸네일: 있으면 그 이미지, 없으면 기본 이미지, 스포일러면 빈 칸", () => {
    expect(pastGameCardView(pastGame({ thumbnailUrl: "/a.png" }), now).thumbnailUrl).toBe("/a.png");
    expect(pastGameCardView(pastGame({}), now).thumbnailUrl).toBe(OG_IMAGE.url);
    expect(
      pastGameCardView(pastGame({ thumbnailUrl: "/a.png", thumbnailSpoiler: true }), now)
        .thumbnailUrl,
    ).toBeNull();
  });
});
