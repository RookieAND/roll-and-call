import { describe, expect, it } from "vitest";

import { hideReason } from "./hide-reason";

describe("hideReason", () => {
  it("칩 이름을 그대로, 기타는 「기타 · 입력」으로 저장한다", () => {
    expect(hideReason({ chip: "부적절한 이미지", otherText: "무시" })).toBe("부적절한 이미지");
    expect(hideReason({ chip: "기타", otherText: "  허위 일정 " })).toBe("기타 · 허위 일정");
  });

  it("고르지 않았거나 기타 입력이 비면 빈 문자열", () => {
    expect(hideReason({ chip: null, otherText: "" })).toBe("");
    expect(hideReason({ chip: "기타", otherText: "  " })).toBe("");
  });
});
