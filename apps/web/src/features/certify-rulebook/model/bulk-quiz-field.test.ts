import { describe, expect, it } from "vitest";

import { bulkQuizAnswerField, bulkQuizFieldRulebookId } from "./bulk-quiz-field";

describe("bulkQuizAnswerField", () => {
  it("만든 필드 이름에서 책 id를 되돌린다", () => {
    expect(bulkQuizFieldRulebookId(bulkQuizAnswerField("book"))).toBe("book");
  });

  it("퀴즈 필드가 아니면 비어 있다", () => {
    expect(bulkQuizFieldRulebookId("quizAnswer")).toBeNull();
    expect(bulkQuizFieldRulebookId(undefined)).toBeNull();
  });
});
