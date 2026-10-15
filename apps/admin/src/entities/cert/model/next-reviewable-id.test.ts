import { describe, expect, it } from "vitest";

import { nextReviewableId } from "./next-reviewable-id";

const rows = [
  { id: "a", waiting: false },
  { id: "b", waiting: false },
  { id: "c", waiting: false },
  { id: "w", waiting: true },
];

describe("nextReviewableId", () => {
  it("목록 안의 다음 심사 가능 건", () => {
    expect(nextReviewableId({ rows, currentId: "a" })).toBe("b");
  });

  it("마지막 심사 가능 건이면 null", () => {
    expect(nextReviewableId({ rows, currentId: "c" })).toBeNull();
  });

  it("기다리는 서플리먼트에서는 앞쪽 첫 심사 가능 건", () => {
    expect(nextReviewableId({ rows, currentId: "w" })).toBe("a");
  });
});
