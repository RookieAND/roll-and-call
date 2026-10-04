import { describe, expect, it } from "vitest";

import { heldBadges } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import { roleGroups } from "./role-groups";

const now = new Date("2026-10-20T03:00:00Z");
const record = (badgeKey: string, earnedAt = "2026-09-20T03:00:00Z"): BadgeRecord => ({
  badgeKey,
  tier: 1,
  earnedAt: new Date(earnedAt),
  notifiedAt: now,
  categoryName: null,
  source: null,
});
const groupsOf = (tab: "gm" | "pl" | "special", records: BadgeRecord[]) =>
  roleGroups({ tab, held: heldBadges(records, now), records, now });

describe("roleGroups", () => {
  it("GM 탭 맨 아래에 이달의 GM ×횟수와 받은 달, 다는 중이면 말일까지", () => {
    const groups = groupsOf("gm", [
      record("gm.total"),
      record("gm.monthly.2026-09"),
      record("gm.monthly.2026-05"),
      record("gm.monthly.2026-03"),
    ]);
    expect(groups.map((group) => group.title)).toEqual(["누적", "이달의 기록"]);
    expect(groups.at(-1)!.rows[0]).toMatchObject({
      name: "이달의 GM ×3",
      requirement: "2026년 9월 · 5월 · 3월",
      note: "10월 31일까지 프로필에 붙습니다",
    });
  });

  it("특별 탭은 운영진 지급 칭호가 앞, 설명 한 줄과 받은 날", () => {
    const groups = groupsOf("special", [
      record("sp.critical", "2026-09-20T03:00:00Z"),
      record("sp.dev", "2026-09-25T03:00:00Z"),
    ]);
    expect(groups[0]!.rows.map((row) => [row.name, row.requirement, row.dateLabel])).toEqual([
      ["개발자", "롤앤콜을 만든 사람입니다.", "2026년 9월 25일"],
      ["대성공", expect.any(String), "2026년 9월 20일"],
    ]);
  });
});
