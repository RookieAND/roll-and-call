import { describe, expect, it } from "vitest";

import { SUPPLEMENT_OPTION_STATE } from "@/entities/rulebook";

import { pickSupplements } from "./pick-supplements";

const options = [
  { id: "a", name: "인비전", state: SUPPLEMENT_OPTION_STATE.open },
  { id: "b", name: "쿠라마 신류 유파북", state: SUPPLEMENT_OPTION_STATE.open },
];

describe("pickSupplements", () => {
  it("고른 책을 목록 순서로 앞에 두고 직접 입력한 책은 뒤에 남긴다", () => {
    const result = pickSupplements({
      items: [
        { name: "새 책", rulebookId: null },
        { name: "인비전", rulebookId: "a" },
      ],
      options,
      ids: ["b", "a"],
    });
    expect(result).toEqual([
      { name: "인비전", rulebookId: "a" },
      { name: "쿠라마 신류 유파북", rulebookId: "b" },
      { name: "새 책", rulebookId: null },
    ]);
  });

  it("모두 풀면 등록된 책만 빠진다", () => {
    const result = pickSupplements({
      items: [
        { name: "인비전", rulebookId: "a" },
        { name: "새 책", rulebookId: null },
      ],
      options,
      ids: [],
    });
    expect(result).toEqual([{ name: "새 책", rulebookId: null }]);
  });
});
