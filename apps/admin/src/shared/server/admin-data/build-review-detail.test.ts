import { describe, expect, it } from "vitest";

import { buildReviewDetail } from "./build-review-detail";
import { REVIEW_LIST_TAB } from "./review-list-tab";
import { REVIEW_DEFAULT_SORT } from "./review-sort";
import type { ReviewListFilter } from "./select-review-rows";
import type { AdminUser, AuditEntry, Review, Session } from "./types";

const DAY = 86_400_000;
const NOW = new Date("2026-10-05T12:00:00+09:00").getTime();

const users = [
  { id: "u-a", nickname: "새닉네임" },
  { id: "u-b", nickname: "가람" },
] as AdminUser[];
const sessions = [
  { id: "g-1", title: "붉은 여관의 밤", gmId: "u-b" },
  { id: "g-2", title: "마지막 열차", gmId: "u-b" },
] as Session[];

const review = (fields: Partial<Review> & { id: string; authorId: string; sessionId: string }) =>
  ({
    authorRole: "participant",
    body: "좋았습니다",
    spoiler: false,
    photoUrls: [],
    createdAt: new Date(NOW),
    held: false,
    ...fields,
  }) as Review;

const reviews = [
  review({ id: "r1", authorId: "u-a", sessionId: "g-1", createdAt: new Date(NOW - DAY) }),
  review({ id: "r2", authorId: "u-b", sessionId: "g-1", createdAt: new Date(NOW - 2 * DAY) }),
  review({
    id: "r3",
    authorId: "u-a",
    sessionId: "g-2",
    removed: { reason: "", by: "알 수 없음", at: new Date(NOW) },
  }),
];

const audit = (fields: Partial<AuditEntry>) => fields as AuditEntry;
const auditLog = [
  audit({ action: "후기 숨김", targetUserId: "u-a", target: "옛닉네임의 후기 · 붉은 여관의 밤" }),
  audit({
    action: "후기 숨김 해제",
    targetUserId: "u-a",
    target: "옛닉네임의 후기 · 붉은 여관의 밤",
  }),
  audit({ action: "후기 제거", targetUserId: "u-a", target: "새닉네임의 후기 · 마지막 열차" }),
  audit({ action: "후기 숨김", targetUserId: "u-b", target: "가람의 후기 · 붉은 여관의 밤" }),
];

const filter: ReviewListFilter = { tab: REVIEW_LIST_TAB.all, sort: REVIEW_DEFAULT_SORT };
const detail = (id: string) =>
  buildReviewDetail({ reviews, users, sessions, auditLog, id, filter, now: NOW });

describe("buildReviewDetail", () => {
  it("받은 조치는 작성자 id로 세서 닉네임을 바꾸기 전 기록도 들어간다", () => {
    expect(detail("r1")?.author.receivedActionCount).toBe(2);
  });

  it("쓴 후기 수에서 지운 후기를 뺀다", () => {
    expect(detail("r1")?.author.reviewCount).toBe(1);
  });

  it("쓴 후기 수에 GM 후기는 세지 않는다", () => {
    const withGm = [
      ...reviews,
      review({ id: "r4", authorId: "u-a", sessionId: "g-1", authorRole: "gm" }),
    ];
    const result = buildReviewDetail({
      reviews: withGm,
      users,
      sessions,
      auditLog,
      id: "r1",
      filter,
      now: NOW,
    });
    expect(result?.author.reviewCount).toBe(1);
  });

  it("다음 건은 들어온 목록 순서를 따르고 마지막이면 null이다", () => {
    expect(detail("r1")?.nextId).toBe("r2");
    expect(detail("r2")?.nextId).toBeNull();
  });

  it("지운 후기와 없는 id는 null이다", () => {
    expect(detail("r3")).toBeNull();
    expect(detail("nope")).toBeNull();
  });
});
