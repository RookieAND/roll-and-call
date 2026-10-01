import { describe, expect, it } from "vitest";

import type { ForumReview } from "./load-forum-review";
import { reviewForumPost } from "./review-forum-post";

const tags = new Map([
  ["스포O", "spoiler"],
  ["스포X", "no-spoiler"],
  ["TRPG", "trpg"],
  ["CoC", "coc"],
  ["기타", "other"],
]);

const review = {
  id: "r1",
  gameId: "g1",
  body: "재미있었어요. 반전이 좋았습니다 || 정말로",
  spoiler: false,
  photoUrls: ["https://cdn.example/a/1.png", "https://cdn.example/a/2"],
  hiddenAt: null,
  removedAt: null,
  threadId: null,
  gameTitle: "붉은 여관의 밤",
  rule: "CoC 7th",
  category: "크툴루의 부름",
  gmName: "달빛토끼",
  authorName: "게굴",
  authorDiscordId: "123",
  absent: false,
  absenceCancelledAt: null,
} satisfies ForumReview;

describe("reviewForumPost", () => {
  it("본문은 평문으로 두고 아래에 작성자·룰·GM·링크 한 줄을 붙인다", () => {
    const post = reviewForumPost({
      review,
      tagIds: tags,
      siteOrigin: "https://roll-and-call.vercel.app",
    });
    expect(post.name).toBe("붉은 여관의 밤 후기 · 게굴");
    expect(post.appliedTags).toEqual(["no-spoiler", "trpg", "coc"]);
    expect(post.content).toBe(
      "재미있었어요. 반전이 좋았습니다 || 정말로\n\n-# 작성자 <@123> · 룰 크툴루의 부름 · GM 달빛토끼 · [롤앤콜에서 보기](<https://roll-and-call.vercel.app/games/g1/reviews>)",
    );
    expect(post.photos.map((photo) => photo.name)).toEqual(["photo-1.png", "photo-2.jpg"]);
  });

  it("스포일러면 제목에 [스포있음], 본문과 사진을 가린다", () => {
    const post = reviewForumPost({
      review: { ...review, spoiler: true, category: null },
      tagIds: tags,
      siteOrigin: undefined,
    });
    expect(post.name.startsWith("[스포있음] ")).toBe(true);
    expect(post.appliedTags).toEqual(["spoiler", "trpg", "other"]);
    expect(post.content).toBe(
      "||재미있었어요. 반전이 좋았습니다 | | 정말로||\n\n-# 작성자 <@123> · 룰 CoC 7th · GM 달빛토끼",
    );
    expect(post.photos.every((photo) => photo.name.startsWith("SPOILER_"))).toBe(true);
  });

  it("글자 수가 넘치면 아래 한 줄을 뺀다", () => {
    const body = "가".repeat(1990);
    expect(
      reviewForumPost({ review: { ...review, body }, tagIds: tags, siteOrigin: undefined }).content,
    ).toBe(body);
  });
});
