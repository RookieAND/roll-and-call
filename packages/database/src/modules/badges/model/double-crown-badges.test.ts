import { describe, expect, it } from "vitest";

import { doubleCrownBadges } from "./double-crown-badges";

const winner = (userId: string, ladder: string, month: string, day: number) => ({
  userId,
  badgeKey: `${ladder}.${month}`,
  tier: 1,
  earnedAt: new Date(Date.UTC(2026, Number(month.slice(5)), day)),
  sourceGameId: null,
});

describe("doubleCrownBadges", () => {
  it("같은 달에 GM과 PL을 함께 받으면 쌍관왕을 준다", () => {
    const result = doubleCrownBadges([
      winner("a", "gm.monthly", "2026-08", 1),
      winner("a", "pl.monthly", "2026-08", 1),
    ]);
    expect(result).toEqual([
      {
        userId: "a",
        badgeKey: "sp.crown",
        tier: 1,
        earnedAt: new Date(Date.UTC(2026, 8, 1)),
        sourceGameId: null,
      },
    ]);
  });

  it("달이 다르면 주지 않는다", () => {
    expect(
      doubleCrownBadges([
        winner("a", "gm.monthly", "2026-07", 1),
        winner("a", "pl.monthly", "2026-08", 1),
      ]),
    ).toEqual([]);
  });

  it("한 역할만 받으면 주지 않는다", () => {
    expect(doubleCrownBadges([winner("a", "gm.monthly", "2026-08", 1)])).toEqual([]);
  });

  it("여러 번 겹치면 가장 이른 달 기준으로 한 번만 준다", () => {
    const result = doubleCrownBadges([
      winner("a", "gm.monthly", "2026-09", 1),
      winner("a", "pl.monthly", "2026-09", 1),
      winner("a", "gm.monthly", "2026-08", 1),
      winner("a", "pl.monthly", "2026-08", 1),
    ]);
    expect(result).toHaveLength(1);
    expect(result[0]!.earnedAt).toEqual(new Date(Date.UTC(2026, 8, 1)));
  });

  it("사람마다 따로 센다", () => {
    const result = doubleCrownBadges([
      winner("a", "gm.monthly", "2026-08", 1),
      winner("b", "pl.monthly", "2026-08", 1),
    ]);
    expect(result).toEqual([]);
  });
});
