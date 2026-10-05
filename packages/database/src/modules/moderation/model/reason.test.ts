import { describe, expect, it } from "vitest";

import { CONTENT_REASON } from "./content-reason";
import { parseReason } from "./parse-reason";
import { reasonLabel } from "./reason-label";

describe("reasonLabel", () => {
  it("목록 이름, 기타는 「기타 · 입력」, 코드가 없으면 빈 글자", () => {
    expect(reasonLabel({ code: "image", text: null, reasons: CONTENT_REASON })).toBe(
      "부적절한 이미지",
    );
    expect(reasonLabel({ code: "other", text: "허위 일정", reasons: CONTENT_REASON })).toBe(
      "기타 · 허위 일정",
    );
    expect(reasonLabel({ code: null, text: null, reasons: CONTENT_REASON })).toBe("");
    expect(reasonLabel({ code: "gone", text: null, reasons: CONTENT_REASON })).toBe("gone");
  });
});

describe("parseReason", () => {
  it("목록 코드만 받고 기타가 아니면 글을 버린다", () => {
    expect(
      parseReason({ reason: { code: "abuse", text: "무시" }, reasons: CONTENT_REASON }),
    ).toEqual({
      code: "abuse",
      text: null,
    });
    expect(
      parseReason({ reason: { code: "other", text: " 허위 " }, reasons: CONTENT_REASON }),
    ).toEqual({
      code: "other",
      text: "허위",
    });
  });

  it("코드가 없거나 목록 밖, 기타 글이 비거나 100자를 넘으면 던진다", () => {
    expect(() => parseReason({ reason: null, reasons: CONTENT_REASON })).toThrow(
      "사유를 골라 주세요",
    );
    expect(() =>
      parseReason({ reason: { code: "toString", text: "" }, reasons: CONTENT_REASON }),
    ).toThrow("사유를 골라 주세요");
    expect(() =>
      parseReason({ reason: { code: "other", text: "  " }, reasons: CONTENT_REASON }),
    ).toThrow("기타 사유를 적어 주세요");
    expect(() =>
      parseReason({ reason: { code: "other", text: "가".repeat(101) }, reasons: CONTENT_REASON }),
    ).toThrow("100자");
  });
});
