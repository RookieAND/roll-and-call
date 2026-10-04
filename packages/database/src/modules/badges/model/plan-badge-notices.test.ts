import { describe, expect, it } from "vitest";

import { planBadgeNotices, type BadgeGrant } from "./plan-badge-notices";

const now = new Date("2026-10-08T00:05:00+09:00");
const after = new Date("2026-10-07T12:00:00Z");

const grant = (overrides: Partial<BadgeGrant["badge"]> & Partial<BadgeGrant> = {}): BadgeGrant => ({
  badge: {
    badgeKey: overrides.badgeKey ?? "pl.total",
    tier: overrides.tier ?? 2,
    earnedAt: overrides.earnedAt ?? after,
    sourceGameId: null,
  },
  notifiedTier: overrides.notifiedTier ?? null,
  categoryName: overrides.categoryName ?? null,
});

describe("planBadgeNotices", () => {
  it("새 단계는 알림 한 줄이고 시트는 없다", () => {
    expect(planBadgeNotices({ grants: [grant({ notifiedTier: 1 })], now })).toEqual({
      notifications: [
        {
          kind: "badge_earned",
          params: { emoji: "🎒", name: "떠돌이", criterion: "세션 10회 참석" },
        },
      ],
      sheet: false,
    });
  });

  it("같은 단계나 이전 최고 이하로 다시 받으면 알리지 않는다", () => {
    expect(planBadgeNotices({ grants: [grant({ notifiedTier: 2 })], now }).notifications).toEqual(
      [],
    );
    expect(
      planBadgeNotices({ grants: [grant({ tier: 1, notifiedTier: 3 })], now }).notifications,
    ).toEqual([]);
  });

  it("출시 소급분은 알림 없이 시트 대상이다", () => {
    const plan = planBadgeNotices({
      grants: [grant({ earnedAt: new Date("2026-09-01T00:00:00Z") })],
      now,
    });
    expect(plan).toEqual({ notifications: [], sheet: true });
  });

  it("숨겨진 칭호는 hidden_title_earned이고 시트 대상이다", () => {
    const plan = planBadgeNotices({ grants: [grant({ badgeKey: "sp.critical", tier: 1 })], now });
    expect(plan.notifications[0]).toMatchObject({
      kind: "hidden_title_earned",
      params: { emoji: "💥", name: "대성공" },
    });
    expect(plan.sheet).toBe(true);
  });

  it("첫 뱃지와 함께 받은 룰별 뱃지는 둘 다 알리고 시트를 띄운다", () => {
    const plan = planBadgeNotices({
      grants: [
        grant({ tier: 1 }),
        grant({ badgeKey: "pl.rule.c1", tier: 1, categoryName: "피아스코" }),
      ],
      now,
    });
    expect(plan.sheet).toBe(true);
    expect(plan.notifications.map((notification) => notification.params)).toEqual([
      { emoji: "🎲", name: "첫 주사위", criterion: "세션 1회 참석" },
      { emoji: "🌱", name: "피아스코 입문자", criterion: "피아스코 세션 1회 참석" },
    ]);
  });

  it("이달의 뱃지는 지난달 것만 monthly_award로 알리고 시트는 없다", () => {
    const plan = planBadgeNotices({
      grants: [
        grant({
          badgeKey: "gm.monthly.2026-09",
          tier: 1,
          earnedAt: new Date("2026-09-30T15:00:00Z"),
        }),
        grant({
          badgeKey: "pl.monthly.2026-08",
          tier: 1,
          earnedAt: new Date("2026-08-31T15:00:00Z"),
        }),
      ],
      now,
    });
    expect(plan).toEqual({
      notifications: [{ kind: "monthly_award", params: { month: 9, role: "gm" } }],
      sheet: false,
    });
  });
});
