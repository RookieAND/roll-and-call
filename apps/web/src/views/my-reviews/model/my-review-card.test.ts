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
  hiddenReason: null,
  removedAt: null,
  removedReason: null,
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
    expect(card.meta).toBe("크툴루의 부름 · 9/19");
  });

  it("운영진이 지운 후기는 본문 없이 사유만 보이고 버튼이 없다", () => {
    const card = toMyReviewCard(
      { ...row, body: "", removedAt: NOW, removedReason: "개인정보 노출" },
      NOW,
    );
    expect(card.body).toBeNull();
    expect(card.callout?.lines).toEqual(["사유: 개인정보 노출"]);
    expect(card.actions).toBe(MY_REVIEW_ACTIONS.none);
  });

  it("숨긴 후기는 사유와 해제 안내를 함께 적는다", () => {
    const card = toMyReviewCard({ ...row, hiddenAt: NOW, hiddenReason: "스포일러 미표시" }, NOW);
    expect(card.callout?.lines).toEqual([
      "사유: 스포일러 미표시",
      "고친 뒤 디스코드로 해제를 요청해 주세요.",
    ]);
  });
});
