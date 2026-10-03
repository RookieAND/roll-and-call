import { describe, expect, it } from "vitest";

import type { BadgeFacts, BadgeSession } from "./badge-facts";
import { computeBadges } from "./compute-badges";
import { diffBadges } from "./diff-badges";
import { monthlyWinners } from "./monthly-winners";

function session(index: number, categoryId: string | null = "coc"): BadgeSession {
  const endsAt = new Date(Date.UTC(2026, 0, 1 + index));
  return {
    gameId: `g${index}`,
    title: "",
    startsAt: endsAt,
    endsAt,
    categoryId,
    categoryName: null,
    attendedCount: 4,
  };
}

const facts = (overrides: Partial<BadgeFacts>): BadgeFacts => ({
  played: [],
  hosted: [],
  reviews: [],
  written: [],
  draws: [],
  hostedDraws: [],
  joinedAt: null,
  rush: [],
  asOf: new Date(Date.UTC(2027, 0, 1)),
  ...overrides,
});

const sessions = (count: number, categoryId: string | null = "coc") =>
  Array.from({ length: count }, (_, index) => session(index, categoryId));

describe("computeBadges", () => {
  it("단계는 기준을 넘긴 세션의 종료 시각을 획득 시각으로 쓴다", () => {
    const badges = computeBadges(facts({ played: sessions(12) }));
    const total = badges.find((badge) => badge.badgeKey === "pl.total")!;
    expect(total.tier).toBe(2);
    expect(total.sourceGameId).toBe("g9");
    expect(badges.find((badge) => badge.badgeKey === "pl.rule.coc")?.tier).toBe(2);
  });

  it("룰북이 없는 세션은 누적에만 센다", () => {
    const badges = computeBadges(facts({ played: sessions(3, null) }));
    expect(badges.map((badge) => badge.badgeKey)).toEqual(["pl.total"]);
  });

  it("다양성은 서로 다른 룰 분류 수로 센다", () => {
    const hosted = ["a", "b", "b", "c"].map((category, index) => session(index, category));
    const badges = computeBadges(facts({ hosted }));
    const variety = badges.find((badge) => badge.badgeKey === "gm.variety")!;
    expect(variety).toMatchObject({ tier: 1, sourceGameId: "g3" });
  });
});

describe("diffBadges", () => {
  const earned = (tier: number) => ({
    badgeKey: "pl.total",
    tier,
    earnedAt: new Date(),
    sourceGameId: null,
  });

  it("오르면 grant, 내려가면 lower, 사라지면 revoke", () => {
    expect(
      diffBadges({
        stored: [{ badgeKey: "pl.total", tier: 1, revokedAt: null }],
        desired: [earned(2)],
      })[0]!.kind,
    ).toBe("grant");
    expect(
      diffBadges({
        stored: [{ badgeKey: "pl.total", tier: 2, revokedAt: null }],
        desired: [earned(1)],
      })[0]!.kind,
    ).toBe("lower");
    expect(
      diffBadges({ stored: [{ badgeKey: "pl.total", tier: 1, revokedAt: null }], desired: [] })[0]!
        .kind,
    ).toBe("revoke");
    expect(
      diffBadges({
        stored: [{ badgeKey: "pl.total", tier: 1, revokedAt: new Date() }],
        desired: [earned(1)],
      })[0]!.kind,
    ).toBe("grant");
    expect(
      diffBadges({
        stored: [{ badgeKey: "pl.total", tier: 1, revokedAt: null }],
        desired: [earned(1)],
      }),
    ).toEqual([]);
  });
});

describe("monthlyWinners", () => {
  it("끝난 달의 1위를 동점까지 모두 주고 이번 달은 뺀다", () => {
    const september = new Date("2026-09-10T03:00:00Z");
    const october = new Date("2026-10-02T03:00:00Z");
    const winners = monthlyWinners(
      [
        { userId: "a", role: "gm", startsAt: september },
        { userId: "b", role: "gm", startsAt: september },
        { userId: "c", role: "gm", startsAt: october },
      ],
      october,
    );
    expect(winners.map((winner) => [winner.userId, winner.badgeKey])).toEqual([
      ["a", "gm.monthly.2026-09"],
      ["b", "gm.monthly.2026-09"],
    ]);
    expect(winners[0]!.earnedAt.toISOString()).toBe("2026-09-30T15:00:00.000Z");
  });

  it("달 경계는 한국 시각이다", () => {
    const winners = monthlyWinners(
      [{ userId: "a", role: "pl", startsAt: new Date("2026-08-31T16:00:00Z") }],
      new Date("2026-10-01T00:00:00Z"),
    );
    expect(winners[0]!.badgeKey).toBe("pl.monthly.2026-09");
  });
});

describe("작성한 후기", () => {
  it("쓴 후기 수로 단계를 매긴다", () => {
    const written = Array.from({ length: 5 }, (_, index) => ({
      gameId: `g${index}`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + index)),
    }));
    const badges = computeBadges(facts({ written }));
    expect(badges.find((badge) => badge.badgeKey === "pl.reviews")).toMatchObject({
      tier: 2,
      sourceGameId: "g4",
    });
  });
});

describe("숨겨진 칭호", () => {
  const keys = (badges: ReturnType<typeof computeBadges>) =>
    badges.map((badge) => badge.badgeKey).filter((key) => key.startsWith("sp."));
  const drawnAt = new Date(Date.UTC(2026, 5, 1));

  it("추첨 값과 대기 1번으로 판정한다", () => {
    const draws = [
      { gameId: "a", roll: 1, nearMiss: false, drawnAt },
      { gameId: "b", roll: 7, nearMiss: false, drawnAt },
      { gameId: "c", roll: 40, nearMiss: true, drawnAt },
      { gameId: "d", roll: 11, nearMiss: false, drawnAt },
    ];
    expect(keys(computeBadges(facts({ draws })))).toEqual(["sp.critical", "sp.extreme", "sp.near"]);
  });

  it("인기 폭발은 신청자가 정원의 3배이면서 10명 이상이다", () => {
    const hostedDraw = (applicants: number, maxPlayers: number) => ({
      gameId: "g",
      applicants,
      maxPlayers,
      drawnAt,
    });
    expect(keys(computeBadges(facts({ hostedDraws: [hostedDraw(12, 4)] })))).toEqual([
      "sp.popular",
    ]);
    expect(
      keys(computeBadges(facts({ hostedDraws: [hostedDraw(12, 5), hostedDraw(9, 3)] }))),
    ).toEqual([]);
  });

  it("가입 기간은 가입일과 첫 인정 세션 가운데 늦은 때에 받는다", () => {
    const badges = computeBadges(
      facts({
        played: [session(9)],
        joinedAt: new Date(Date.UTC(2026, 0, 1)),
        asOf: new Date(Date.UTC(2026, 1, 5)),
      }),
    );
    expect(keys(badges)).toEqual(["sp.month"]);
    expect(badges.find((badge) => badge.badgeKey === "sp.month")!.earnedAt).toEqual(
      new Date(Date.UTC(2026, 1, 1)),
    );
    expect(keys(computeBadges(facts({ joinedAt: new Date(Date.UTC(2020, 0, 1)) })))).toEqual([]);
  });

  it("더블 헤더는 같은 한국 날짜, 양손잡이는 같은 달, 대규모 원정은 참석 6명부터다", () => {
    const morning = { ...session(0), gameId: "m", startsAt: new Date("2026-03-01T16:00:00Z") };
    const evening = { ...session(0), gameId: "e", startsAt: new Date("2026-03-02T10:00:00Z") };
    expect(keys(computeBadges(facts({ played: [morning], hosted: [evening] })))).toEqual([
      "sp.ambi",
      "sp.double",
    ]);
    expect(keys(computeBadges(facts({ played: [{ ...session(0), attendedCount: 6 }] })))).toEqual([
      "sp.expedition",
    ]);
    expect(keys(computeBadges(facts({ played: [{ ...session(0), attendedCount: 5 }] })))).toEqual(
      [],
    );
  });
});
