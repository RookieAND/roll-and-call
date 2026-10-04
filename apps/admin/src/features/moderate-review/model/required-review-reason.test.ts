import { describe, expect, it } from "vitest";

import { requiredReviewReason } from "./required-review-reason";

describe("requiredReviewReason", () => {
  it("칩 이름을 그대로, 기타는 「기타 · 입력」으로 저장한다", () => {
    expect(requiredReviewReason({ reasonKey: "privacy", otherText: "무시" })).toBe("개인정보 노출");
    expect(requiredReviewReason({ reasonKey: "other", otherText: "  광고 글 " })).toBe(
      "기타 · 광고 글",
    );
  });

  it("사유가 없거나 모르는 사유면 「사유를 골라 주세요」", () => {
    expect(() => requiredReviewReason({ reasonKey: null, otherText: "" })).toThrow(
      "사유를 골라 주세요",
    );
    expect(() => requiredReviewReason({ reasonKey: "nope", otherText: "" })).toThrow(
      "사유를 골라 주세요",
    );
  });

  it("기타 입력이 비었거나 100자를 넘으면 「기타 사유를 적어 주세요」", () => {
    expect(() => requiredReviewReason({ reasonKey: "other", otherText: "   " })).toThrow(
      "기타 사유를 적어 주세요",
    );
    expect(() => requiredReviewReason({ reasonKey: "other", otherText: "가".repeat(101) })).toThrow(
      "기타 사유를 적어 주세요",
    );
    expect(requiredReviewReason({ reasonKey: "other", otherText: "가".repeat(100) })).toBe(
      `기타 · ${"가".repeat(100)}`,
    );
  });
});
