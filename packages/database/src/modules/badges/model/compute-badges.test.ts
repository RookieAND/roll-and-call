import { describe, expect, it } from "vitest";

import type { BadgeDraw, BadgeFacts, BadgeSession } from "./badge-facts";
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
    registeredAt: new Date(Date.UTC(2025, 0, 1)),
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
  fullCasts: [],
  certified: [],
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
    expect(badges.map((badge) => badge.badgeKey).filter((key) => !key.startsWith("sp."))).toEqual([
      "pl.total",
    ]);
  });

  it("다양성은 서로 다른 룰 분류 수로 센다", () => {
    const hosted = ["a", "b", "b", "c"].map((category, index) => session(index, category));
    const badges = computeBadges(facts({ hosted }));
    const variety = badges.find((badge) => badge.badgeKey === "gm.variety")!;
    expect(variety).toMatchObject({ tier: 1, sourceGameId: "g3" });
  });

  it("PL 다양한 룰 참여는 서로 다른 룰 3·5·7·10·15종이 각 1~5단계다", () => {
    const tierAt = (kinds: number) => {
      const played = Array.from({ length: kinds }, (_, index) => session(index, `rule${index}`));
      return computeBadges(facts({ played })).find((badge) => badge.badgeKey === "pl.variety")
        ?.tier;
    };
    expect([2, 3, 4, 5, 6, 7, 9, 10, 14, 15].map(tierAt)).toEqual([
      undefined,
      1,
      1,
      2,
      2,
      3,
      3,
      4,
      4,
      5,
    ]);
  });

  it("PL 다양한 룰 참여는 같은 룰 여러 번을 1종으로, 룰북 없는 세션은 0종으로 센다", () => {
    const sameRule = computeBadges(facts({ played: sessions(10) }));
    expect(sameRule.some((badge) => badge.badgeKey === "pl.variety")).toBe(false);
    const noRulebook = computeBadges(facts({ played: sessions(5, null) }));
    expect(noRulebook.some((badge) => badge.badgeKey === "pl.variety")).toBe(false);
  });

  it("PL 다양한 룰 참여는 진행(GM) 세션을 세지 않고 획득 시각은 3번째 새 룰의 종료 시각이다", () => {
    const rules = ["a", "b", "b", "c", "d"].map((category, index) => session(index, category));
    const asGm = computeBadges(facts({ hosted: rules }));
    expect(asGm.some((badge) => badge.badgeKey === "pl.variety")).toBe(false);
    const asPlayer = computeBadges(facts({ played: rules }));
    expect(asPlayer.find((badge) => badge.badgeKey === "pl.variety")).toMatchObject({
      tier: 1,
      sourceGameId: "g3",
    });
  });
});

describe("diffBadges 근거 갱신", () => {
  const badge = (sourceGameId: string, earnedAt: Date) => ({
    badgeKey: "sp.expedition",
    tier: 1,
    earnedAt,
    sourceGameId,
  });
  const at = new Date("2026-09-30T00:00:00Z");

  it("같은 단계에서 근거 구인이 바뀌면 알리지 않고 갱신한다", () => {
    expect(
      diffBadges({
        stored: [{ ...badge("old", at), revokedAt: null }],
        desired: [badge("new", at)],
      }),
    ).toEqual([{ kind: "refresh", badge: badge("new", at) }]);
  });

  it("획득 시각만 바뀌어도 갱신하고, 같으면 아무것도 하지 않는다", () => {
    const later = new Date("2026-10-01T00:00:00Z");
    expect(
      diffBadges({
        stored: [{ ...badge("same", at), revokedAt: null }],
        desired: [badge("same", later)],
      }),
    ).toEqual([{ kind: "refresh", badge: badge("same", later) }]);
    expect(
      diffBadges({
        stored: [{ ...badge("same", at), revokedAt: null }],
        desired: [badge("same", at)],
      }),
    ).toEqual([]);
  });

  it("저장된 근거를 모르면(월간 뱃지 등) 갱신하지 않는다", () => {
    expect(
      diffBadges({
        stored: [{ badgeKey: "sp.expedition", tier: 1, revokedAt: null }],
        desired: [badge("new", at)],
      }),
    ).toEqual([]);
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
        { userId: "a", role: "gm", startsAt: september, weight: 1 },
        { userId: "b", role: "gm", startsAt: september, weight: 1 },
        { userId: "c", role: "gm", startsAt: october, weight: 1 },
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
      [{ userId: "a", role: "pl", startsAt: new Date("2026-08-31T16:00:00Z"), weight: 1 }],
      new Date("2026-10-01T00:00:00Z"),
    );
    expect(winners[0]!.badgeKey).toBe("pl.monthly.2026-09");
  });
});

describe("작성한 후기·받은 후기", () => {
  const reviewsOf = (count: number) =>
    Array.from({ length: count }, (_, index) => ({
      gameId: `g${index}`,
      createdAt: new Date(Date.UTC(2026, 0, 1 + index)),
    }));

  it("쓴 후기 수로 단계를 매긴다", () => {
    const badges = computeBadges(facts({ written: reviewsOf(5) }));
    expect(badges.find((badge) => badge.badgeKey === "pl.reviews")).toMatchObject({
      tier: 2,
      sourceGameId: "g4",
    });
  });

  it("받은 후기 수로 단계를 매긴다", () => {
    const badges = computeBadges(facts({ reviews: reviewsOf(12) }));
    expect(badges.find((badge) => badge.badgeKey === "gm.reviews")).toMatchObject({ tier: 2 });
  });
});

describe("숨겨진 칭호", () => {
  const keys = (badges: ReturnType<typeof computeBadges>) =>
    badges.map((badge) => badge.badgeKey).filter((key) => key.startsWith("sp."));
  const drawnAt = new Date(Date.UTC(2026, 5, 1));
  const draw = (overrides: Partial<BadgeDraw>): BadgeDraw => ({
    gameId: "g",
    roll: 60,
    nearMiss: false,
    picked: false,
    applicants: 4,
    maxPlayers: 4,
    drawnAt,
    lastSeat: false,
    contested: true,
    ...overrides,
  });

  it("바늘구멍은 신청자가 정원의 3배이면서 10명 이상인 추첨에서 뽑힌 때다", () => {
    expect(
      keys(
        computeBadges(facts({ draws: [draw({ picked: true, applicants: 12, maxPlayers: 4 })] })),
      ),
    ).toEqual(["sp.needle"]);
    expect(
      keys(
        computeBadges(
          facts({
            draws: [
              draw({ picked: true, applicants: 9, maxPlayers: 3 }),
              draw({ picked: false, applicants: 12, maxPlayers: 4 }),
            ],
          }),
        ),
      ),
    ).toEqual([]);
  });

  it("마라톤은 360분 이상인 인정 세션이다", () => {
    const lasting = (minutes: number) => ({
      ...session(0),
      endsAt: new Date(session(0).startsAt.getTime() + minutes * 60_000),
    });
    expect(keys(computeBadges(facts({ played: [lasting(360)] })))).toEqual(["sp.marathon"]);
    expect(keys(computeBadges(facts({ hosted: [lasting(359)] })))).toEqual([]);
    expect(keys(computeBadges(facts({ played: [lasting(180)] })))).toEqual([]);
  });

  it("추첨 값과 대기 1번으로 판정한다", () => {
    const draws = [
      draw({ gameId: "a", roll: 1 }),
      draw({ gameId: "b", roll: 10 }),
      draw({ gameId: "c", roll: 40, nearMiss: true }),
      draw({ gameId: "d", roll: 11 }),
    ];
    expect(keys(computeBadges(facts({ draws })))).toEqual([
      "sp.critical",
      "sp.extreme",
      "sp.near",
      "sp.slump3",
    ]);
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

  it("트리플 헤더는 같은 날 세 번째 세션이 근거다", () => {
    const day = (index: number) => ({
      ...session(index),
      gameId: `t${index}`,
      startsAt: new Date(`2026-03-02T0${index}:00:00Z`),
      endsAt: new Date(`2026-03-02T0${index + 1}:00:00Z`),
    });
    const badges = computeBadges(facts({ played: [day(1), day(2)], hosted: [day(3)] }));
    expect(keys(badges)).toEqual(expect.arrayContaining(["sp.double", "sp.triple"]));
    expect(badges.find((badge) => badge.badgeKey === "sp.triple")!.sourceGameId).toBe("t3");
    expect(keys(computeBadges(facts({ played: [day(1), day(2)] })))).not.toContain("sp.triple");
  });

  it("더블 헤더는 같은 한국 날짜, 양손잡이는 같은 달, 대규모 원정은 참석 6명부터다", () => {
    const morning = { ...session(0), gameId: "m", startsAt: new Date("2026-03-01T16:00:00Z") };
    const evening = { ...session(0), gameId: "e", startsAt: new Date("2026-03-02T10:00:00Z") };
    expect(keys(computeBadges(facts({ played: [morning], hosted: [evening] })))).toEqual([
      "sp.ambi",
      "sp.double",
      "sp.owl",
    ]);
    expect(keys(computeBadges(facts({ played: [{ ...session(0), attendedCount: 6 }] })))).toEqual([
      "sp.expedition",
    ]);
    expect(keys(computeBadges(facts({ played: [{ ...session(0), attendedCount: 5 }] })))).toEqual(
      [],
    );
  });
});
