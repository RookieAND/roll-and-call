import { describe, expect, it } from "vitest";

import { canEditReview } from "./can-edit-review";
import { deriveReviewState } from "./derive-review-state";
import { REVIEW_STATE } from "./review-state";
import { reviewWriteDeadline } from "./review-write-deadline";

const NOW = new Date("2026-09-28T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const review = {
  createdAt: new Date(NOW.getTime() - 3 * DAY),
  hiddenAt: null,
  removedAt: null,
  authorAbsent: false,
};

describe("deriveReviewState", () => {
  it("등록하고 14일 안이면 고칠 수 있다", () => {
    expect(deriveReviewState(review, NOW)).toBe(REVIEW_STATE.editable);
  });

  it("14일이 지나면 잠긴다", () => {
    const old = { ...review, createdAt: new Date(NOW.getTime() - 14 * DAY) };
    expect(deriveReviewState(old, NOW)).toBe(REVIEW_STATE.locked);
  });

  it("제거가 숨김·보류보다 앞선다", () => {
    const removed = { ...review, removedAt: NOW, hiddenAt: NOW, authorAbsent: true };
    expect(deriveReviewState(removed, NOW)).toBe(REVIEW_STATE.removed);
  });

  it("불참으로 바뀐 작성자의 후기는 보류다", () => {
    expect(deriveReviewState({ ...review, authorAbsent: true }, NOW)).toBe(REVIEW_STATE.held);
  });

  it("숨긴 후기는 기한이 지나도 고칠 수 있고 보류는 못 고친다", () => {
    expect(canEditReview(REVIEW_STATE.hidden)).toBe(true);
    expect(canEditReview(REVIEW_STATE.held)).toBe(false);
    expect(canEditReview(REVIEW_STATE.locked)).toBe(false);
  });
});

describe("reviewWriteDeadline", () => {
  it("출석 확정 14일 뒤까지 받는다", () => {
    expect(reviewWriteDeadline(new Date("2026-09-20T12:00:00+09:00")).toISOString()).toBe(
      new Date("2026-10-04T12:00:00+09:00").toISOString(),
    );
  });
});
