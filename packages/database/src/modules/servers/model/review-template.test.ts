import { describe, expect, it } from "vitest";

import {
  DEFAULT_REVIEW_TEMPLATE,
  renderReviewTemplate,
  validateReviewTemplate,
  type ReviewTemplatePart,
} from "./review-template";

const parts: ReviewTemplatePart[] = ["title", "body"];

describe("DEFAULT_REVIEW_TEMPLATE", () => {
  it("기본 양식은 허용 변수만 쓴다", () => {
    for (const part of parts) {
      expect(validateReviewTemplate({ part, text: DEFAULT_REVIEW_TEMPLATE[part] })).toBeUndefined();
    }
  });
});

describe("validateReviewTemplate", () => {
  it("비우면 기본 양식으로 되돌리므로 막지 않는다", () => {
    expect(validateReviewTemplate({ part: "body", text: "" })).toBeUndefined();
  });

  it("본문 양식에 {후기 본문}이 없으면 막는다", () => {
    expect(validateReviewTemplate({ part: "body", text: "{구인 제목} 후기" })).toBe(
      "{후기 본문}가 있어야 후기가 올라갑니다.",
    );
  });

  it("제목에는 본문과 멘션 변수를 쓸 수 없다", () => {
    expect(validateReviewTemplate({ part: "title", text: "{후기 본문}" })).toBe(
      "{후기 본문}는 쓸 수 없는 변수입니다.",
    );
    expect(validateReviewTemplate({ part: "title", text: "{GM 멘션}" })).toBe(
      "{GM 멘션}는 쓸 수 없는 변수입니다.",
    );
  });

  it("@everyone과 @here, 글자 수 초과를 막는다", () => {
    expect(validateReviewTemplate({ part: "body", text: "@everyone {후기 본문}" })).toBe(
      "@everyone과 @here는 쓸 수 없습니다.",
    );
    expect(validateReviewTemplate({ part: "title", text: "가".repeat(101) })).toBe(
      "100자까지 쓸 수 있습니다.",
    );
  });
});

describe("renderReviewTemplate", () => {
  const values = { "구인 제목": "붉은 여관의 밤", 작성자: "게굴", "스포 표시": undefined };

  it("빈 변수는 공백을 하나로 줄이고 앞뒤를 다듬는다", () => {
    expect(
      renderReviewTemplate({
        template: "{스포 표시} {구인 제목} 후기 · {작성자}",
        values,
        reviewBody: "",
      }),
    ).toBe("붉은 여관의 밤 후기 · 게굴");
  });

  it("후기 본문의 줄바꿈과 들여쓰기는 그대로 둔다", () => {
    const reviewBody = "첫 줄\n    들여쓴 줄\n\n\n끝";
    expect(renderReviewTemplate({ template: "{후기 본문}\n\n{작성자}", values, reviewBody })).toBe(
      `${reviewBody}\n\n게굴`,
    );
  });

  it("후기 본문에 $가 있어도 치환 패턴으로 읽지 않는다", () => {
    expect(
      renderReviewTemplate({ template: "{후기 본문}", values, reviewBody: "$& 1000원 $1" }),
    ).toBe("$& 1000원 $1");
  });

  it("줄 끝에 남은 구분점을 지운다", () => {
    expect(
      renderReviewTemplate({
        template: "{후기 본문}\n-# 작성자 {작성자} · {롤앤콜 링크}",
        values,
        reviewBody: "후기 · 입니다 ·",
      }),
    ).toBe("후기 · 입니다 ·\n-# 작성자 게굴");
  });
});
