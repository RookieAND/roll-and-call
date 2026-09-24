import type { Game } from "@roll-and-call/database";
import { describe, expect, it } from "vitest";

import { gameStatus } from "./game-status";
import { gridCell } from "./grid-cell";
import { POST_STATUS } from "./post-status";

const NOW = new Date("2026-09-24T12:00:00+09:00").getTime();
const game = (fields: Partial<Game>) =>
  ({ confirmedAt: null, playMinutes: 180, endDate: new Date(NOW + 1), ...fields }) as Game;

describe("gameStatus", () => {
  it("확정 시각에 플레이 시간을 더해 끝났으면 종료, 아니면 확정", () => {
    expect(gameStatus(game({ confirmedAt: new Date(NOW - 4 * 3_600_000) }), NOW)).toBe(
      POST_STATUS.ended,
    );
    expect(gameStatus(game({ confirmedAt: new Date(NOW - 2 * 3_600_000) }), NOW)).toBe(
      POST_STATUS.confirmed,
    );
  });

  it("미확정이면 모집 마감 전은 모집 중, 뒤는 일정 조율 중", () => {
    expect(gameStatus(game({}), NOW)).toBe(POST_STATUS.recruiting);
    expect(gameStatus(game({ endDate: new Date(NOW - 1) }), NOW)).toBe(POST_STATUS.scheduling);
  });
});

describe("gridCell", () => {
  it("서울 시각으로 요일(월=0)과 시간대를 고른다", () => {
    expect(gridCell(new Date("2026-09-24T20:30:00+09:00"))).toEqual({ day: 3, slot: 4 });
    expect(gridCell(new Date("2026-09-27T01:00:00+09:00"))).toEqual({ day: 6, slot: 6 });
    expect(gridCell(new Date("2026-09-21T09:00:00+09:00"))).toEqual({ day: 0, slot: 0 });
  });
});
