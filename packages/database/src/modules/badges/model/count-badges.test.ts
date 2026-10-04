import { describe, expect, it } from "vitest";

import { countBadges } from "./count-badges";

const now = new Date("2026-10-05T03:00:00Z");

describe("countBadges", () => {
  it("단계형은 받은 단계 수만큼 센다", () => {
    expect(countBadges([{ badgeKey: "pl.total", tier: 3 }], now)).toEqual({
      gm: 0,
      pl: 3,
      special: 0,
      total: 3,
    });
  });

  it("이달의 뱃지는 지금 다는 지난달 것만 1개로 센다", () => {
    const held = [
      { badgeKey: "gm.monthly.2026-09", tier: 1 },
      { badgeKey: "gm.monthly.2026-08", tier: 1 },
    ];
    expect(countBadges(held, now).gm).toBe(1);
    expect(countBadges([{ badgeKey: "gm.monthly.2026-08", tier: 1 }], now).gm).toBe(0);
  });

  it("특별 칭호는 1개씩 세고 합계는 세 칸의 합이다", () => {
    const held = [
      { badgeKey: "gm.rule.coc", tier: 2 },
      { badgeKey: "gm.variety", tier: 1 },
      { badgeKey: "pl.rule.coc", tier: 4 },
      { badgeKey: "sp.dev", tier: 1 },
      { badgeKey: "sp.critical", tier: 1 },
      { badgeKey: "pl.retired", tier: 3 },
    ];
    expect(countBadges(held, now)).toEqual({ gm: 3, pl: 4, special: 2, total: 9 });
  });
});
