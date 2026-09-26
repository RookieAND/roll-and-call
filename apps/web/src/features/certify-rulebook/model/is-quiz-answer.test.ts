import { describe, expect, it } from "vitest";

import { isQuizAnswer } from "./is-quiz-answer";

describe("isQuizAnswer", () => {
  it("공백과 대소문자를 가리지 않고 답 가운데 하나와 맞춘다", () => {
    expect(isQuizAnswer({ answer: " 월드 가이드", answers: ["월드가이드"] })).toBe(true);
    expect(isQuizAnswer({ answer: "world guide", answers: ["룰", "World Guide"] })).toBe(true);
    expect(isQuizAnswer({ answer: "룰 가이드", answers: ["월드 가이드"] })).toBe(false);
    expect(isQuizAnswer({ answer: " ", answers: [""] })).toBe(false);
  });
});
