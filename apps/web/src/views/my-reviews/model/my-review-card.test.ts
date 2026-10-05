import { describe, expect, it } from "vitest";

import type { MyReviewRow } from "@/shared/server";

import { MY_REVIEW_ACTIONS, toMyReviewCard } from "./my-review-card";

const NOW = new Date("2026-09-28T12:00:00+09:00");
const row = {
  id: "review",
  gameId: "game",
  body: "첫 CoC였는데 GM님이 판정 규칙을 그때그때 짚어 주셨습니다.",
  spoiler: false,
  photoUrls: [],
  createdAt: new Date("2026-09-28T10:00:00+09:00"),
  updatedAt: null,
  hiddenAt: null,
  hiddenReasonCode: null,
  hiddenReasonText: null,
  removedAt: null,
  removedReasonCode: null,
  removedReasonText: null,
  authorAbsent: false,
  gameTitle: "물벼락",
  gameRule: "크툴루의 부름",
  sessionAt: new Date("2026-09-19T20:00:00+09:00"),
} as MyReviewRow;

describe("toMyReviewCard", () => {
  it("방금 쓴 후기는 수정 D-14 배지와 두 버튼을 단다", () => {
    const card = toMyReviewCard(row, NOW);
    expect(card.badge).toEqual({ label: "수정 D-14", palette: "primary" });
    expect(card.actions).toBe(MY_REVIEW_ACTIONS.editAndDelete);
    expect(card.meta).toBe("크툴루의 부름 · 9월 19일");
    expect(card.subject).toBe("물벼락 · 9월 19일 세션");
  });

  it("보류된 후기는 불참 안내와 삭제 버튼만 단다", () => {
    const card = toMyReviewCard({ ...row, authorAbsent: true }, NOW);
    expect(card.badge).toEqual({ label: "보류", palette: "gray" });
    expect(card.callout?.title).toBe("불참으로 바뀌어 비공개되었습니다");
    expect(card.actions).toBe(MY_REVIEW_ACTIONS.delete);
  });

  it("수정 기한 마지막 날은 수정 오늘까지로 적는다", () => {
    const lastDay = new Date("2026-10-12T09:00:00+09:00");
    expect(toMyReviewCard(row, lastDay).badge?.label).toBe("수정 오늘까지");
  });

  it("운영진이 지운 후기는 본문 없이 사유만 보이고 버튼이 없다", () => {
    const card = toMyReviewCard(
      { ...row, body: "", removedAt: NOW, removedReasonCode: "privacy" },
      NOW,
    );
    expect(card.body).toBeNull();
    expect(card.callout?.lines).toEqual(["사유: 개인정보 노출"]);
    expect(card.actions).toBe(MY_REVIEW_ACTIONS.none);
  });

  it("숨긴 후기는 사유와 해제 안내를 함께 적는다", () => {
    const card = toMyReviewCard(
      { ...row, hiddenAt: NOW, hiddenReasonCode: "other", hiddenReasonText: "결말 노출" },
      NOW,
    );
    expect(card.callout?.lines).toEqual([
      "사유: 기타 · 결말 노출",
      "고친 뒤 디스코드로 해제를 요청해 주세요.",
    ]);
  });
});
