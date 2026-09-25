import { describe, expect, it } from "vitest";

import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { BOOK_ROW } from "./book-row";
import { categoryCards } from "./category-cards";

const day = (value: number) => new Date(Date.UTC(2026, 8, value));
const book = (id: string, overrides: Partial<MyRulebook>) =>
  ({
    id,
    shortName: id,
    categoryId: "dx",
    categoryName: "더블크로스",
    edition: "3rd",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

describe("categoryCards", () => {
  it("기본 룰북 두 권 중 한 권이면 나머지를 신청하라고 한다", () => {
    const { ready, inProgress } = categoryCards({
      enforcementDate: null,
      requests: [],
      rulebooks: [
        book("1권", { state: CERT_STATE.certified, stateAt: day(10) }),
        book("2권", {}),
        book("상급", { kind: "supplement" }),
      ],
    });
    expect(ready).toEqual([]);
    expect(inProgress[0]).toMatchObject({
      badge: { label: "1권 더 필요" },
      cta: { button: "2권 신청", rulebookIds: ["2권"] },
    });
    expect(inProgress[0]!.rows.map((row) => row.type)).toEqual([
      BOOK_ROW.certified,
      BOOK_ROW.missing,
    ]);
  });

  it("신판 인증은 구판까지 GM 가능으로 묶고 서플리먼트를 더 낼 수 있다고 알린다", () => {
    const newer = book("수호자 룰북", {
      categoryId: "coc",
      categoryName: "크툴루의 부름",
      edition: "7판",
      state: CERT_STATE.certified,
      stateAt: day(2),
    });
    const { ready } = categoryCards({
      enforcementDate: null,
      requests: [],
      rulebooks: [
        newer,
        book("펄프 크툴루", { categoryId: "coc", edition: "7판", kind: "supplement" }),
        book("탐사자 핸드북", { categoryId: "coc", edition: "7판", kind: "handbook" }),
        book("수호자 룰북 6", { categoryId: "coc", edition: "6판", unlockedBy: newer }),
      ],
    });
    expect(ready[0]).toMatchObject({ summary: "7판·6판 GM 가능", cta: null });
    expect(ready[0]!.rows.map((row) => row.type)).toEqual([
      BOOK_ROW.certified,
      BOOK_ROW.add,
      BOOK_ROW.unlocked,
    ]);
  });

  it("기록이 없는 카테고리는 빼고, 반려된 카테고리를 진행 중 맨 위에 둔다", () => {
    const { inProgress } = categoryCards({
      enforcementDate: null,
      requests: [],
      rulebooks: [
        book("인세인", { categoryId: "i", state: CERT_STATE.pending, stateAt: day(22) }),
        book("마기카로기아", { categoryId: "m", state: CERT_STATE.rejected, stateAt: day(18) }),
        book("아곤", { categoryId: "a" }),
      ],
    });
    expect(inProgress.map((card) => card.badge.label)).toEqual(["반려됨", "확인 중"]);
  });
});
