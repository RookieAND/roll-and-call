import { describe, expect, it } from "vitest";

import type { BadgeSession } from "./badge-facts";
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
  };
}

const sessions = (count: number, categoryId: string | null = "coc") =>
  Array.from({ length: count }, (_, index) => session(index, categoryId));

describe("computeBadges", () => {
  it("단계는 기준을 넘긴 세션의 종료 시각을 획득 시각으로 쓴다", () => {
    const badges = computeBadges({ played: sessions(12), hosted: [], reviews: [] });
    const total = badges.find((badge) => badge.badgeKey === "pl.total")!;
    expect(total.tier).toBe(2);
    expect(total.sourceGameId).toBe("g9");
    expect(badges.find((badge) => badge.badgeKey === "pl.rule.coc")?.tier).toBe(2);
  });

  it("룰북이 없는 세션은 누적에만 센다", () => {
    const badges = computeBadges({ played: sessions(3, null), hosted: [], reviews: [] });
    expect(badges.map((badge) => badge.badgeKey)).toEqual(["pl.total"]);
  });

  it("다양성은 서로 다른 룰 분류 수로 센다", () => {
    const hosted = ["a", "b", "b", "c"].map((category, index) => session(index, category));
    const badges = computeBadges({ played: [], hosted, reviews: [] });
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
      diffBadges([{ badgeKey: "pl.total", tier: 1, revokedAt: null }], [earned(2)])[0]!.kind,
    ).toBe("grant");
    expect(
      diffBadges([{ badgeKey: "pl.total", tier: 2, revokedAt: null }], [earned(1)])[0]!.kind,
    ).toBe("lower");
    expect(diffBadges([{ badgeKey: "pl.total", tier: 1, revokedAt: null }], [])[0]!.kind).toBe(
      "revoke",
    );
    expect(
      diffBadges([{ badgeKey: "pl.total", tier: 1, revokedAt: new Date() }], [earned(1)])[0]!.kind,
    ).toBe("grant");
    expect(diffBadges([{ badgeKey: "pl.total", tier: 1, revokedAt: null }], [earned(1)])).toEqual(
      [],
    );
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
