import { describe, expect, it } from "vitest";

import { kindImpactLosers } from "./kind-impact-losers";

const now = Date.parse("2026-10-05T00:00:00Z");
const book = (id: string, kind: "core" | "supplement", edition = "3rd") => ({
  id,
  category: "더블크로스",
  edition,
  kind,
  hidden: false,
  certRequired: true,
});
const user = (id: string) => ({ id, nickname: id });
const cert = (userId: string, rulebookId: string) => ({ userId, rulebookId });
const session = (gmId: string, rulebookId: string, daysAgo: number) => ({
  gmId,
  rulebookId,
  startsAt: new Date(now - daysAgo * 86_400_000),
});

const records = (overrides: object) =>
  ({
    rulebooks: [],
    certifications: [],
    sessions: [],
    users: ["가", "나", "다", "라"].map(user),
    ...overrides,
  }) as never;

describe("kindImpactLosers", () => {
  it("판본의 하나뿐인 기본 룰북을 서플리먼트로 바꾸면 그 책 인증자가 잃는다", () => {
    const losers = kindImpactLosers({
      records: records({
        rulebooks: [book("1권", "core")],
        certifications: [cert("가", "1권"), cert("나", "1권")],
        sessions: [session("나", "1권", 10)],
      }),
      rulebookId: "1권",
      nextKind: "supplement",
      now,
    });
    expect(losers.map((loser) => loser.userId)).toEqual(["나", "가"]);
  });

  it("다른 기본 룰북이 남으면 아무도 잃지 않는다", () => {
    expect(
      kindImpactLosers({
        records: records({
          rulebooks: [book("1권", "core"), book("2권", "core")],
          certifications: [cert("가", "1권")],
        }),
        rulebookId: "1권",
        nextKind: "supplement",
        now,
      }),
    ).toEqual([]);
  });

  it("서플리먼트를 기본 룰북으로 바꾸면 이 책 인증 없는 기존 GM이 잃는다", () => {
    const losers = kindImpactLosers({
      records: records({
        rulebooks: [book("1권", "core"), book("상급", "supplement")],
        certifications: [cert("가", "1권"), cert("나", "1권"), cert("나", "상급")],
        sessions: [session("다", "1권", 200)],
      }),
      rulebookId: "상급",
      nextKind: "core",
      now,
    });
    expect(losers.map((loser) => loser.userId)).toEqual(["가", "다"]);
  });

  it("기본 룰북끼리·종류가 그대로면 비어 있다", () => {
    expect(
      kindImpactLosers({
        records: records({ rulebooks: [book("상급", "supplement")] }),
        rulebookId: "상급",
        nextKind: "handbook",
        now,
      }),
    ).toEqual([]);
  });
});
