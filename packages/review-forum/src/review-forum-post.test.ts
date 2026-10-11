import type { ForumReview } from "@roll-and-call/database/reviews";
import { describe, expect, it } from "vitest";

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
  isGmReview: false,
  body: "재미있었어요. 반전이 좋았습니다 || 정말로",
  spoiler: false,
  photoUrls: ["https://cdn.example/a/1.png", "https://cdn.example/a/2"],
  hiddenAt: null,
  removedAt: null,
  threadId: null,
  gameTitle: "붉은 여관의 밤",
  gameHiddenAt: null,
  rule: "CoC 7th",
  category: "크툴루의 부름",
  gmName: "달빛토끼",
  gmDiscordId: "999",
  participantDiscordIds: ["123", "456"],
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
      reviewsUrl: "https://roll-and-call.vercel.app/trpia/games/g1/reviews",
    });
    expect(post.name).toBe("붉은 여관의 밤 후기 · 게굴");
    expect(post.appliedTags).toEqual(["no-spoiler", "trpg", "coc"]);
    expect(post.content).toBe(
      "재미있었어요. 반전이 좋았습니다 || 정말로\n\n-# 작성자 <@123> · 룰 크툴루의 부름 · GM 달빛토끼 · [롤앤콜에서 보기](<https://roll-and-call.vercel.app/trpia/games/g1/reviews>)",
    );
    expect(post.photos.map((photo) => photo.name)).toEqual(["photo-1.png", "photo-2.jpg"]);
  });

  it("스포일러면 제목에 [스포있음], 본문과 사진을 가린다", () => {
    const post = reviewForumPost({
      review: { ...review, spoiler: true, category: null },
      tagIds: tags,
      reviewsUrl: undefined,
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
      reviewForumPost({ review: { ...review, body }, tagIds: tags, reviewsUrl: undefined }).content,
    ).toBe(body);
  });

  it("GM 후기는 제목 맨 앞에 [GM 후기]를 붙이고 스포일러 표시가 그 뒤에 온다", () => {
    const gmReview = { ...review, isGmReview: true } satisfies ForumReview;
    const plain = reviewForumPost({ review: gmReview, tagIds: tags, reviewsUrl: undefined });
    expect(plain.name).toBe("[GM 후기] 붉은 여관의 밤 후기 · 게굴");
    const spoiler = reviewForumPost({
      review: { ...gmReview, spoiler: true },
      tagIds: tags,
      reviewsUrl: undefined,
    });
    expect(spoiler.name).toBe("[GM 후기] [스포있음] 붉은 여관의 밤 후기 · 게굴");
  });
});

describe("reviewForumPost 서버 양식", () => {
  const template = {
    title: "{후기 종류} {구인 제목}",
    body: "세션명: {구인 제목}\n사용룰: {룰}\nGM: {GM 멘션}\nPL: {참여자 멘션}\n\n후기: {후기 본문}",
  };

  it("서버가 정한 양식으로 제목과 본문을 채운다", () => {
    const post = reviewForumPost({ review, tagIds: tags, reviewsUrl: undefined, template });
    expect(post.name).toBe("PL 후기 붉은 여관의 밤");
    expect(post.content).toBe(
      "세션명: 붉은 여관의 밤\n사용룰: 크툴루의 부름\nGM: <@999>\nPL: <@123> <@456>\n\n후기: 재미있었어요. 반전이 좋았습니다 || 정말로",
    );
  });

  it("GM 후기는 {후기 종류}가 GM 후기로 채워진다", () => {
    const post = reviewForumPost({
      review: { ...review, isGmReview: true },
      tagIds: tags,
      reviewsUrl: undefined,
      template,
    });
    expect(post.name).toBe("GM 후기 붉은 여관의 밤");
  });

  it("양식을 채운 결과가 비면 기본 양식으로 올린다", () => {
    const post = reviewForumPost({
      review,
      tagIds: tags,
      reviewsUrl: undefined,
      template: { title: "{스포 표시}", body: "{스포 표시}" },
    });
    expect(post.name).toBe("붉은 여관의 밤 후기 · 게굴");
    expect(post.content.startsWith("재미있었어요.")).toBe(true);
  });

  it("양식을 쓰면 후기 본문을 가리는 스포일러 처리는 그대로 유지한다", () => {
    const post = reviewForumPost({
      review: { ...review, spoiler: true },
      tagIds: tags,
      reviewsUrl: undefined,
      template,
    });
    expect(post.content.endsWith("후기: ||재미있었어요. 반전이 좋았습니다 | | 정말로||")).toBe(
      true,
    );
  });
});
