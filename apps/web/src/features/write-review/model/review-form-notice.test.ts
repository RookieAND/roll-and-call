import { describe, expect, it } from "vitest";

import { reviewFormNotice, reviewFormTitle } from "./review-form-notice";

const editUntil = new Date("2026-10-12T12:00:00+09:00");

describe("마스터링 후기 문구", () => {
  it("GM이면 앱바 제목과 새 글 안내가 마스터링 후기로 바뀐다", () => {
    expect(reviewFormTitle({ editing: false, gm: true })).toBe("마스터링 후기 쓰기");
    expect(reviewFormTitle({ editing: true, gm: true })).toBe("마스터링 후기 고치기");
    expect(reviewFormNotice({ review: null, editUntil, gm: true }).title).toBe(
      "이 세션의 마스터링 후기를 작성합니다",
    );
  });

  it("참석자 문구는 그대로다", () => {
    expect(reviewFormTitle({ editing: false, gm: false })).toBe("후기 쓰기");
    expect(reviewFormNotice({ review: null, editUntil }).title).toBe(
      "이 세션의 공개 후기를 작성합니다",
    );
  });
});
