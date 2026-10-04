import { describe, expect, it } from "vitest";

import { SORT_DIR } from "@/shared/lib";

import { REVIEW_LIST_TAB } from "./review-list-tab";
import { REVIEW_PHOTO_FILTER } from "./review-photo-filter";
import { REVIEW_DEFAULT_SORT, REVIEW_SORT_COLUMN } from "./review-sort";
import { REVIEW_WINDOW_STATE } from "./review-window-state";
import { selectReviewRows, type ReviewListFilter } from "./select-review-rows";
import type { AdminUser, Review, Session } from "./types";

const DAY = 86_400_000;
const NOW = new Date("2026-10-05T12:00:00+09:00").getTime();

const users = [
  { id: "u-gm", nickname: "오후의산책" },
  { id: "u-a", nickname: "Alice" },
  { id: "u-b", nickname: "가람" },
  { id: "u-c", nickname: "나비" },
] as AdminUser[];

const session = (fields: Partial<Session> & { id: string; title: string }) =>
  ({ gmId: "u-gm", ...fields }) as Session;

const sessions = [
  session({ id: "g-inn", title: "붉은 여관의 밤", attendanceFirstConfirmedAt: new Date(NOW) }),
  session({ id: "g-train", title: "Midnight Train" }),
  session({ id: "g-pending", title: "안개 낀 등대" }),
  session({
    id: "g-open",
    title: "열린 기한",
    attendanceFirstConfirmedAt: new Date(NOW - 3 * DAY),
    attendanceConfirmedAt: new Date(NOW - DAY),
  }),
  session({
    id: "g-closed",
    title: "닫힌 기한",
    attendanceFirstConfirmedAt: new Date(NOW - 20 * DAY),
  }),
];

const review = (fields: Partial<Review> & { id: string; authorId: string; sessionId: string }) =>
  ({
    body: "좋았습니다",
    spoiler: false,
    photoUrls: [],
    createdAt: new Date(NOW),
    held: false,
    ...fields,
  }) as Review;

const hidden = { reason: "욕설·비방", by: "달빛토끼", at: new Date(NOW) };
const removed = { reason: "", by: "알 수 없음", at: new Date(NOW) };

const reviews = [
  review({ id: "r1", authorId: "u-a", sessionId: "g-inn", createdAt: new Date(NOW - 3 * DAY) }),
  review({
    id: "r2",
    authorId: "u-b",
    sessionId: "g-inn",
    createdAt: new Date(NOW - DAY),
    hidden,
    spoiler: true,
    photoUrls: ["a.png"],
  }),
  review({ id: "r3", authorId: "u-c", sessionId: "g-train", createdAt: new Date(NOW - 2 * DAY) }),
  review({ id: "r4", authorId: "u-a", sessionId: "g-train", removed }),
  review({ id: "r5", authorId: "u-b", sessionId: "g-open", removed }),
];

const select = (filter: Partial<ReviewListFilter>) =>
  selectReviewRows({
    reviews,
    users,
    sessions,
    filter: { tab: REVIEW_LIST_TAB.all, sort: REVIEW_DEFAULT_SORT, ...filter },
    now: NOW,
  });
const ids = (filter: Partial<ReviewListFilter>) => select(filter).rows.map((row) => row.id);

describe("selectReviewRows", () => {
  it("지워진 후기를 빼고 작성 시각 ↓가 기본이다", () => {
    expect(ids({})).toEqual(["r2", "r3", "r1"]);
    expect(select({}).counts).toEqual({ all: 3, hidden: 1 });
  });

  it("작성 시각 ↑, 작성자 가나다로 정렬한다", () => {
    const ascending = { column: REVIEW_SORT_COLUMN.createdAt, dir: SORT_DIR.asc };
    expect(ids({ sort: ascending })).toEqual(["r1", "r3", "r2"]);
    const byAuthor = { column: REVIEW_SORT_COLUMN.author, dir: SORT_DIR.asc };
    expect(ids({ sort: byAuthor })).toEqual(["r2", "r3", "r1"]);
  });

  it("숨긴 후기 탭은 숨긴 것만 두고 「숨김」 뱃지를 뺀다", () => {
    expect(select({}).rows[0]?.badges).toEqual(["숨김", "스포일러 포함"]);
    const hiddenTab = select({ tab: REVIEW_LIST_TAB.hidden });
    expect(hiddenTab.rows.map((row) => row.id)).toEqual(["r2"]);
    expect(hiddenTab.rows[0]?.badges).toEqual(["스포일러 포함"]);
  });

  it("작성자 닉네임·구인 제목을 대소문자 없이 찾고 건수에는 반영하지 않는다", () => {
    expect(ids({ query: "  alice " })).toEqual(["r1"]);
    expect(ids({ query: "midnight" })).toEqual(["r3"]);
    expect(select({ query: "midnight" }).counts).toEqual({ all: 3, hidden: 1 });
  });

  it("사진 있음·없음으로 거른다", () => {
    expect(ids({ photo: REVIEW_PHOTO_FILTER.with })).toEqual(["r2"]);
    expect(ids({ photo: REVIEW_PHOTO_FILTER.without })).toEqual(["r3", "r1"]);
  });

  it("구인 칩이 있으면 그 구인 후기만, 탭 건수도 그 구인 기준이다", () => {
    const inn = select({ game: "g-inn", query: "가람" });
    expect(inn.rows.map((row) => row.id)).toEqual(["r2"]);
    expect(inn.counts).toEqual({ all: 2, hidden: 1 });
    expect(inn.game?.title).toBe("붉은 여관의 밤");
  });

  it("모르는 구인 id면 칩 없이 전체로 본다", () => {
    const unknown = select({ game: "nope" });
    expect(unknown.game).toBeNull();
    expect(unknown.counts.all).toBe(3);
  });

  it("칩 0건이면 출석 상태를 돌려준다(기한 = 첫 출석 확정 + 14일)", () => {
    expect(select({ game: "g-pending" }).game?.window).toEqual({
      state: REVIEW_WINDOW_STATE.pending,
      deadline: null,
    });
    expect(select({ game: "g-open" }).game?.window).toEqual({
      state: REVIEW_WINDOW_STATE.open,
      deadline: new Date(NOW + 11 * DAY),
    });
    expect(select({ game: "g-closed" }).game?.window).toEqual({
      state: REVIEW_WINDOW_STATE.closed,
      deadline: new Date(NOW - 6 * DAY),
    });
  });
});
