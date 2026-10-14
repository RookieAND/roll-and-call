import { describe, expect, it } from "vitest";

import { foldSupplements } from "./fold-supplements";

const books = (count: number) => Array.from({ length: count }, (_, index) => `책 ${index + 1}`);

describe("foldSupplements", () => {
  it("4권까지는 접지 않는다", () => {
    expect(foldSupplements({ items: books(4), expanded: false })).toEqual({
      visible: books(4),
      foldable: false,
      hiddenCount: 0,
    });
  });

  it("5권부터 앞의 3권만 보이고 나머지 수를 알려 준다", () => {
    expect(foldSupplements({ items: books(7), expanded: false })).toEqual({
      visible: books(3),
      foldable: true,
      hiddenCount: 4,
    });
  });

  it("펼치면 모두 보인다", () => {
    expect(foldSupplements({ items: books(7), expanded: true }).visible).toEqual(books(7));
  });
});
