import { describe, expect, it } from "vitest";

import { pickBulkQuizBooks } from "./pick-bulk-quiz-books";

const ids = ["a", "b", "c", "d", "e", "f", "g", "h"];

describe("pickBulkQuizBooks", () => {
  it("3권 이하면 모두 낸다", () => {
    expect(pickBulkQuizBooks({ userId: "u1", quizBookIds: ["a", "b"] })).toEqual(["a", "b"]);
    expect(pickBulkQuizBooks({ userId: "u1", quizBookIds: [] })).toEqual([]);
  });

  it("3권보다 많으면 3권만 고르고 받은 순서를 지킨다", () => {
    const picked = pickBulkQuizBooks({ userId: "u1", quizBookIds: ids });
    expect(picked).toHaveLength(3);
    expect(picked).toEqual(ids.filter((id) => picked.includes(id)));
  });

  it("같은 사람·같은 묶음이면 순서가 달라도 같은 책을 고른다", () => {
    const first = pickBulkQuizBooks({ userId: "u1", quizBookIds: ids });
    const shuffled = pickBulkQuizBooks({ userId: "u1", quizBookIds: ids.toReversed() });
    expect(shuffled.toSorted()).toEqual(first.toSorted());
  });

  it("사람이 다르면 고르는 책이 달라질 수 있다", () => {
    const picks = new Set(
      ["u1", "u2", "u3", "u4", "u5", "u6"].map((userId) =>
        pickBulkQuizBooks({ userId, quizBookIds: ids }).join(),
      ),
    );
    expect(picks.size).toBeGreaterThan(1);
  });
});
