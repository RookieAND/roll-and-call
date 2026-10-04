import { describe, expect, it } from "vitest";

import { pickQuizQuestion } from "./pick-quiz-question";

const questions = ["a", "b", "c", "d", "e", "f", "g"].map((id) => ({ id }));
const input = { questions, userId: "user-1", rulebookId: "book-1", rejectedCount: 0 };

describe("pickQuizQuestion", () => {
  it("같은 입력이면 늘 같은 문항이다", () => {
    expect(pickQuizQuestion(input)).toBe(pickQuizQuestion({ ...input }));
  });

  it("반려 횟수가 바뀌면 다시 고른다", () => {
    const picks = new Set(
      [0, 1, 2, 3, 4, 5].map((rejectedCount) => pickQuizQuestion({ ...input, rejectedCount })?.id),
    );
    expect(picks.size).toBeGreaterThan(1);
  });

  it("문항이 없으면 null이다", () => {
    expect(pickQuizQuestion({ ...input, questions: [] })).toBeNull();
  });
});
