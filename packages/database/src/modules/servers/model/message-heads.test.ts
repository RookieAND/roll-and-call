import { describe, expect, it } from "vitest";

import { validateMessageHead } from "./message-heads";
import { renderMessageHead } from "./render-message-head";

describe("renderMessageHead", () => {
  it("빈 변수는 빈칸으로 바꾸고 공백을 하나로 줄인다", () => {
    expect(
      renderMessageHead({
        template: "📢 {룰}  새 구인: {구인 제목}",
        values: { 룰: "", "구인 제목": "달그림자" },
      }),
    ).toBe("📢 새 구인: 달그림자");
  });
  it("전부 비면 빈 문자열이다", () => {
    expect(renderMessageHead({ template: " {룰} ", values: {} })).toBe("");
  });
});

describe("validateMessageHead", () => {
  it("everyone, 없는 변수, 글자 수를 막는다", () => {
    expect(validateMessageHead({ key: "open", text: "@everyone hi" })).toBeDefined();
    expect(validateMessageHead({ key: "open", text: "{참가자}" })).toContain("{참가자}");
    expect(validateMessageHead({ key: "open", text: "가".repeat(301) })).toBeDefined();
    expect(validateMessageHead({ key: "monthly", text: "{달} 발표" })).toBeUndefined();
    expect(validateMessageHead({ key: "monthly", text: "{GM}" })).toBeDefined();
  });
});
