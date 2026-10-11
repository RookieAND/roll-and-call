import { describe, expect, it } from "vitest";

import { bulkFormHint } from "./bulk-form-hint";

const base = { onQuiz: false, photoMissing: "사진", quizMissing: "퀴즈", hasQuizError: false };

describe("bulkFormHint", () => {
  it("사진 단계에서는 사진 안내를 보인다", () => {
    expect(bulkFormHint(base)).toBe("사진");
  });

  it("퀴즈 단계에서는 퀴즈 안내를 보인다", () => {
    expect(bulkFormHint({ ...base, onQuiz: true })).toBe("퀴즈");
  });

  it("틀린 답이 있으면 고치라고 한다", () => {
    expect(bulkFormHint({ ...base, onQuiz: true, hasQuizError: true })).toBe(
      "답을 고친 뒤 다시 신청해 주세요",
    );
  });
});
