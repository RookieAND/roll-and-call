import { describe, expect, it } from "vitest";

import type { BadgeRecord } from "@/shared/server";

import { monthlyCard } from "./monthly-card";

const now = new Date("2026-10-20T03:00:00Z");
const record = (badgeKey: string): BadgeRecord => ({
  badgeKey,
  tier: 1,
  earnedAt: now,
  notifiedAt: now,
  categoryName: null,
  source: null,
});
const appearance = (userId: string, startsAt: string) => ({
  userId,
  role: "gm" as const,
  startsAt: new Date(startsAt),
  score: 100,
  sessions: 1,
});
const appearances = [
  appearance("me", "2026-09-10T03:00:00Z"),
  appearance("me", "2026-09-12T03:00:00Z"),
  appearance("me", "2026-10-10T03:00:00Z"),
  appearance("rival", "2026-10-11T03:00:00Z"),
  appearance("rival", "2026-10-12T03:00:00Z"),
];

describe("monthlyCard", () => {
  it("다는 중이면 지난달 1위 줄, 말일까지, ×횟수와 받은 달, 이번 달 줄", () => {
    const card = monthlyCard({
      ladder: "gm.monthly",
      records: [record("gm.monthly.2026-09"), record("gm.monthly.2025-12")],
      appearances,
      userId: "me",
      now,
    });
    expect(card).toMatchObject({
      held: true,
      ribbon: "9월",
      status: "9월 점수 1위 · 2회 진행",
      description: "10월 31일까지 프로필에 붙습니다.",
      monthLine: "10월 100점 · 2위 · 1위 200점",
      history: "×2 · 2026년 9월 · 2025년 12월",
    });
  });

  it("다는 중이 아니면 이번 달 줄과 안내, 받은 적 없음", () => {
    const card = monthlyCard({ ladder: "pl.monthly", records: [], appearances, userId: "me", now });
    expect(card).toMatchObject({
      held: false,
      status: null,
      description: "이번 달 점수 1위가 다음 달 한 달 동안 답니다.",
      monthLine: "10월 순위 없음",
      history: "아직 받은 적이 없습니다",
    });
  });
});
