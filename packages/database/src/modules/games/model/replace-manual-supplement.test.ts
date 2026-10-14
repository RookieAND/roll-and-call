import { describe, expect, it } from "vitest";

import { replaceManualSupplement } from "./replace-manual-supplement";

const rulebook = { id: "book-1", name: "쿠라마 신류 유파북" };

describe("replaceManualSupplement", () => {
  it("직접 입력한 줄을 등록된 룰북으로 바꾸고 순서를 지킨다", () => {
    const result = replaceManualSupplement({
      supplements: [
        { name: "인비전", rulebookId: "book-0" },
        { name: "쿠라마신류 유파북", rulebookId: null },
        { name: "다른 책", rulebookId: null },
      ],
      name: "쿠라마 신류 유파북",
      rulebook,
    });
    expect(result).toEqual([
      { name: "인비전", rulebookId: "book-0" },
      { name: "쿠라마 신류 유파북", rulebookId: "book-1" },
      { name: "다른 책", rulebookId: null },
    ]);
  });

  it("이미 그 룰북을 골랐으면 직접 입력한 줄만 뺀다", () => {
    const result = replaceManualSupplement({
      supplements: [
        { name: "쿠라마 신류 유파북", rulebookId: "book-1" },
        { name: "쿠라마 신류 유파북", rulebookId: null },
      ],
      name: "쿠라마 신류 유파북",
      rulebook,
    });
    expect(result).toEqual([{ name: "쿠라마 신류 유파북", rulebookId: "book-1" }]);
  });

  it("바꿀 줄이 없으면 null", () => {
    const result = replaceManualSupplement({
      supplements: [{ name: "인비전", rulebookId: "book-0" }],
      name: "쿠라마 신류 유파북",
      rulebook,
    });
    expect(result).toBeNull();
  });
});
