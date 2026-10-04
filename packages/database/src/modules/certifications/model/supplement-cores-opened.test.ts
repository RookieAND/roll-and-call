import { describe, expect, it } from "vitest";

import { supplementCoresOpened } from "./supplement-cores-opened";

const book = (
  id: string,
  overrides: Partial<Parameters<typeof supplementCoresOpened>[0]["book"]>,
) => ({
  id,
  kind: "core",
  category: "dx",
  edition: "3rd",
  certRequired: true,
  supersedesId: null,
  ...overrides,
});

const books = [
  book("1권", {}),
  book("2권", {}),
  book("상급", { kind: "supplement" }),
  book("신판1권", { edition: "4th", supersedesId: "1권" }),
  book("무료", { category: "free", certRequired: false }),
  book("무료 서플", { category: "free", kind: "supplement" }),
];
const supplement = books[2]!;

describe("supplementCoresOpened", () => {
  it("기본 룰북은 늘 열려 있다", () => {
    expect(supplementCoresOpened({ book: books[0]!, books, certifiedIds: new Set() })).toBe(true);
  });

  it("서플리먼트는 같은 판본 기본 룰북을 모두 열어야 한다", () => {
    expect(supplementCoresOpened({ book: supplement, books, certifiedIds: new Set(["1권"]) })).toBe(
      false,
    );
    expect(
      supplementCoresOpened({ book: supplement, books, certifiedIds: new Set(["1권", "2권"]) }),
    ).toBe(true);
  });

  it("신판 인증과 인증 불필요 기본 룰북도 연 것으로 본다", () => {
    expect(
      supplementCoresOpened({ book: supplement, books, certifiedIds: new Set(["신판1권", "2권"]) }),
    ).toBe(true);
    expect(supplementCoresOpened({ book: books[5]!, books, certifiedIds: new Set() })).toBe(true);
  });
});
