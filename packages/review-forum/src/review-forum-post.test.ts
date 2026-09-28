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
  photoUrls: ["p1", "p2", "p3", "p4", "p5"],
  hiddenAt: null,
  removedAt: null,
  threadId: null,
  gameTitle: "붉은 여관의 밤",
  rule: "CoC 7th",
  category: "크툴루의 부름",
  gmName: "달빛토끼",
  authorName: "게굴",
  authorAvatar: null,
  absent: false,
  absenceCancelledAt: null,
} satisfies ForumReview;

describe("reviewForumPost", () => {
  it("스포일러가 없으면 스포X·TRPG·룰 태그와 사진 4장 묶음을 붙인다", () => {
    const post = reviewForumPost(review, tags, "https://roll-and-call.vercel.app");
    expect(post.name).toBe("붉은 여관의 밤 후기 · 게굴");
    expect(post.appliedTags).toEqual(["no-spoiler", "trpg", "coc"]);
    expect(post.message.embeds).toHaveLength(4);
    expect(post.message.embeds?.[0]?.footer?.text).toBe("사진 1장은 롤앤콜에서 볼 수 있어요");
  });

  it("스포일러면 제목에 [스포있음], 본문을 가리고 사진은 올리지 않는다", () => {
    const post = reviewForumPost({ ...review, spoiler: true, category: null }, tags, undefined);
    expect(post.name.startsWith("[스포있음] ")).toBe(true);
    expect(post.appliedTags).toEqual(["spoiler", "trpg", "other"]);
    expect(post.message.embeds).toHaveLength(1);
    expect(post.message.embeds?.[0]?.description).toBe(
      "||재미있었어요. 반전이 좋았습니다 | | 정말로||",
    );
    expect(post.message.buttons).toEqual([]);
  });
});
