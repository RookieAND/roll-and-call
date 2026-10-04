import { describe, expect, it } from "vitest";

import { heldBadges } from "@/entities/badge";
import type { BadgeRecord } from "@/shared/server";

import { buildAwardSheet } from "./build-award-sheet";

const now = new Date("2026-10-20T03:00:00Z");
const recent = new Date("2026-10-19T12:00:00Z");

const record = (overrides: Partial<BadgeRecord>): BadgeRecord => ({
  badgeKey: "pl.total",
  tier: 1,
  earnedAt: recent,
  notifiedAt: null,
  categoryName: null,
  source: { gameId: "g1", title: "물벼락", startsAt: new Date("2026-09-19T10:00:00Z") },
  ...overrides,
});

const sheetOf = (records: BadgeRecord[]) => buildAwardSheet(heldBadges(records, now));

describe("buildAwardSheet", () => {
  it("첫 뱃지와 함께 받은 뱃지는 칩으로 싣는다", () => {
    const sheet = sheetOf([
      record({}),
      record({ badgeKey: "pl.rule.c1", categoryName: "피아스코" }),
    ]);
    expect(sheet).toMatchObject({
      kind: "first",
      highlights: [
        { name: "첫 주사위", line: "세션 1회 참석", source: { label: "물벼락 · 9월 19일 세션" } },
      ],
      chips: [{ name: "피아스코 입문자" }],
    });
  });

  it("PL·GM 첫 뱃지를 함께 받으면 둘 다 크게 보인다", () => {
    const sheet = sheetOf([record({ badgeKey: "gm.total" }), record({})]);
    expect(sheet).toMatchObject({
      kind: "first",
      highlights: [{ name: "첫 주사위" }, { name: "첫 막", line: "세션 1회 진행" }],
      chips: [],
    });
  });

  it("숨겨진 칭호가 첫 뱃지보다 앞선다", () => {
    const sheet = sheetOf([record({}), record({ badgeKey: "sp.critical" })]);
    expect(sheet).toMatchObject({
      kind: "hidden",
      highlights: [{ name: "대성공" }],
      chips: [{ name: "첫 주사위" }],
    });
  });

  it("출시 소급분이 하나라도 있으면 지금까지의 업적 한 장이다", () => {
    const sheet = sheetOf([
      record({ badgeKey: "sp.critical" }),
      record({ badgeKey: "gm.total", tier: 2, earnedAt: new Date("2026-09-01T00:00:00Z") }),
    ]);
    expect(sheet).toMatchObject({ kind: "retro" });
    expect(sheet?.kind === "retro" && sheet.items).toHaveLength(2);
  });

  it("그 밖의 대기 뱃지나 알린 뱃지만 있으면 시트가 없다", () => {
    expect(sheetOf([record({ tier: 2 })])).toBeNull();
    expect(sheetOf([record({ notifiedAt: recent })])).toBeNull();
  });
});
