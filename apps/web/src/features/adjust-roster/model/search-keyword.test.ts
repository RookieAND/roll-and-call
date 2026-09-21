import { describe, expect, it } from "vitest";

import { searchKeyword } from "./search-keyword";

describe("searchKeyword", () => {
  it("끝에서 조합 중인 자모 하나를 뗀다", () => {
    expect(searchKeyword("하ㄴ")).toBe("하");
    expect(searchKeyword("하늘ㄷ")).toBe("하늘");
  });

  it("완성된 글자와 영문은 그대로 둔다", () => {
    expect(searchKeyword(" 하늘 ")).toBe("하늘");
    expect(searchKeyword("noi")).toBe("noi");
  });
});
