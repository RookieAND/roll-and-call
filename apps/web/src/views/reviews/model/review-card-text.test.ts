import { describe, expect, it } from "vitest";

import type { ReviewCardRow } from "@/shared/server";

import { reviewCardText } from "./review-card-text";
import { REVIEW_PERSPECTIVE } from "./review-perspective";

const row = {
  id: "review",
  gameId: "game",
  authorId: "author",
  authorRole: "participant",
  body: "분위기 묘사가 정말 좋았습니다.",
  spoiler: false,
  photoUrls: [],
  createdAt: new Date("2026-09-20T23:30:00+09:00"),
  updatedAt: null,
  authorName: "윤소라",
  authorAvatarUrl: null,
  gameTitle: "물벼락",
} satisfies ReviewCardRow;

describe("reviewCardText", () => {
  it("세션 후기는 작성자를 첫 줄에 두고 둘째 줄은 작성일만 적는다", () => {
    expect(reviewCardText({ row, perspective: REVIEW_PERSPECTIVE.session })).toEqual({
      title: null,
      meta: "9월 20일",
    });
  });

  it("진행한 세션 후기는 작성자를 첫 줄에 두고 둘째 줄에 구인 제목과 작성일을 적는다", () => {
    const edited = { ...row, updatedAt: new Date("2026-09-21T10:00:00+09:00") };
    expect(reviewCardText({ row: edited, perspective: REVIEW_PERSPECTIVE.received })).toEqual({
      title: null,
      meta: "물벼락 · 9월 20일 · 수정됨",
    });
  });

  it("남이 작성한 후기는 작성일만 적고 날짜는 KST로 센다", () => {
    const lateUtc = { ...row, createdAt: new Date("2026-09-19T15:30:00Z") };
    expect(reviewCardText({ row: lateUtc, perspective: REVIEW_PERSPECTIVE.written }).meta).toBe(
      "9월 20일",
    );
  });
});

describe("reviewCardText GM 후기", () => {
  const gmRow = { ...row, authorRole: "gm" };

  it("세션 후기에서는 작성자를 첫 줄에 두고 둘째 줄을 마스터링 후기와 작성일로 적는다", () => {
    expect(reviewCardText({ row: gmRow, perspective: REVIEW_PERSPECTIVE.session })).toEqual({
      title: null,
      meta: "마스터링 후기 · 9월 20일",
    });
  });

  it("작성한 후기에서는 구인 제목을 그대로 쓴다", () => {
    expect(reviewCardText({ row: gmRow, perspective: REVIEW_PERSPECTIVE.written }).title).toBe(
      "물벼락",
    );
  });
});
