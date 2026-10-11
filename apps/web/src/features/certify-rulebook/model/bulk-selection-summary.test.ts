import { describe, expect, it } from "vitest";

import type { MyRulebook } from "@/entities/rulebook";

import { bulkSelectionSummary } from "./bulk-selection-summary";

const book = (id: string, categoryName: string) => ({ id, categoryName }) as MyRulebook;

const rulebooks = [book("a", "크툴루의 부름"), book("b", "크툴루의 부름"), book("c", "던전월드")];

describe("bulkSelectionSummary", () => {
  it("고른 책을 룰별 권수로 묶는다", () => {
    expect(bulkSelectionSummary({ rulebooks, selectedIds: ["a", "c", "b"] })).toBe(
      "크툴루의 부름 2권 · 던전월드 1권",
    );
  });

  it("고른 책이 없으면 빈 문자열이다", () => {
    expect(bulkSelectionSummary({ rulebooks, selectedIds: [] })).toBe("");
  });
});
