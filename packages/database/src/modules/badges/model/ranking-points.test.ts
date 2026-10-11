import { describe, expect, it } from "vitest";

import { RANKING_MODE } from "#/modules/servers/model/ranking-mode";

import { BADGE_ROLE } from "./badge-ladder";
import { monthlyWinners } from "./monthly-winners";
import { crowdBonusPoints, rankingSessionKind } from "./ranking-points";
import { recordAppearances, reviewAppearances } from "./record-appearances";
import type { RecordGame } from "./record-session";

const START = new Date("2026-09-10T11:00:00Z");
const NOW = new Date("2026-09-20T00:00:00Z");

const player = (userId: string, overrides: Partial<RecordGame["participants"][number]> = {}) => ({
  userId,
  status: "confirmed",
  absent: false,
  absenceCancelledAt: null,
  ...overrides,
});

const game = (overrides: Partial<RecordGame> = {}): RecordGame => ({
  id: "game",
  gmId: "gm",
  confirmedAt: START,
  playMinutes: 120,
  endedAt: null,
  hiddenAt: null,
  cancelledAt: null,
  miniRule: false,
  participants: [player("a"), player("b")],
  ...overrides,
});

const players = (count: number) => Array.from({ length: count }, (_, index) => player(`p${index}`));

const scoreOf = (appearances: ReturnType<typeof recordAppearances>, userId: string, role: string) =>
  appearances
    .filter((appearance) => appearance.userId === userId && appearance.role === role)
    .reduce((sum, appearance) => sum + appearance.weight, 0);

describe("rankingSessionKind", () => {
  it("타이만이 룰 종류보다 먼저이고, 미니룰이 아니면 정식이다", () => {
    expect(rankingSessionKind({ attendedCount: 1, miniRule: true })).toBe("tie");
    expect(rankingSessionKind({ attendedCount: 2, miniRule: true })).toBe("mini");
    expect(rankingSessionKind({ attendedCount: 2, miniRule: false })).toBe("regular");
  });
});

describe("crowdBonusPoints", () => {
  it("참석 6명까지는 없고 7명부터 1명마다 10점이며 최대 50점이다", () => {
    const bonus = (attendedCount: number) => crowdBonusPoints({ attendedCount });
    expect([3, 6, 7, 8, 11, 12, 20].map(bonus)).toEqual([0, 0, 10, 20, 50, 50, 50]);
  });
});

describe("recordAppearances (포인트제)", () => {
  const points = { mode: RANKING_MODE.points };

  it("정식 세션은 GM과 참석자 모두 100점이고, 참석 7명이면 GM에게 10점이 더해진다", () => {
    const appearances = recordAppearances([game({ participants: players(7) })], NOW, points);
    expect(scoreOf(appearances, "gm", BADGE_ROLE.gm)).toBe(110);
    expect(scoreOf(appearances, "p0", BADGE_ROLE.player)).toBe(100);
  });

  it("미니룰은 70점이고 타이만은 점수 집계에서 뺀다", () => {
    expect(
      scoreOf(recordAppearances([game({ miniRule: true })], NOW, points), "a", BADGE_ROLE.player),
    ).toBe(70);
    expect(recordAppearances([game({ participants: [player("a")] })], NOW, points)).toEqual([]);
  });

  it("참여 횟수제는 같은 타이만 세션을 순위에서 뺀다", () => {
    expect(recordAppearances([game({ participants: [player("a")] })], NOW)).toEqual([]);
  });

  it("불참은 PL·GM 점수 모두에서 100점을 빼고, 운영진이 취소한 불참은 뺀다", () => {
    const appearances = recordAppearances(
      [
        game({
          participants: [
            player("a"),
            player("b"),
            player("absent", { absent: true }),
            player("forgiven", { absent: true, absenceCancelledAt: START }),
          ],
        }),
      ],
      NOW,
      points,
    );
    expect(scoreOf(appearances, "absent", BADGE_ROLE.player)).toBe(-100);
    expect(scoreOf(appearances, "absent", BADGE_ROLE.gm)).toBe(-100);
    expect(scoreOf(appearances, "forgiven", BADGE_ROLE.player)).toBe(100);
  });

  it("후기 1건은 쓴 사람(PL)과 받은 GM에게 10점씩이고 세션 횟수로는 세지 않는다", () => {
    const [written, received] = reviewAppearances([
      { authorId: "a", gmId: "gm", createdAt: START },
    ]);
    expect(written).toMatchObject({
      userId: "a",
      role: BADGE_ROLE.player,
      weight: 10,
      sessions: 0,
    });
    expect(received).toMatchObject({ userId: "gm", role: BADGE_ROLE.gm, weight: 10, sessions: 0 });
  });

  it("점수 합이 0 이하인 사람은 이달의 뱃지를 받지 못한다", () => {
    const appearances = recordAppearances(
      [game({ participants: [player("a"), player("c"), player("b", { absent: true })] })],
      NOW,
      points,
    );
    const winners = monthlyWinners(appearances, new Date("2026-10-20T00:00:00Z"));
    expect(winners.map((winner) => winner.userId).sort()).toEqual(["a", "c", "gm"]);
    expect(
      monthlyWinners(
        [{ userId: "x", role: BADGE_ROLE.player, startsAt: START, weight: -100, sessions: 0 }],
        new Date("2026-10-20T00:00:00Z"),
      ),
    ).toEqual([]);
  });
});
