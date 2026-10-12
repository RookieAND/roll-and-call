import { expect, it } from "vitest";

import { recruitPostTitle } from "./recruit-post-title";

it("제목 뒤에 GM을 붙이고 취소면 표시한다", () => {
  expect(recruitPostTitle({ title: "달그림자 여관", gmName: "새벽세시" })).toBe(
    "달그림자 여관 [GM 새벽세시]",
  );
  expect(recruitPostTitle({ title: "달그림자 여관", gmName: "새벽세시", cancelled: true })).toBe(
    "달그림자 여관 [GM 새벽세시] (취소됨)",
  );
});

it("룰 분류가 있으면 제목 앞에 붙인다", () => {
  expect(
    recruitPostTitle({ title: "21세기 바벨탑", gmName: "rullu", ruleLabel: "크툴루의 부름" }),
  ).toBe("[크툴루의 부름] 21세기 바벨탑 [GM rullu]");
  expect(
    recruitPostTitle({
      title: "21세기 바벨탑",
      gmName: "rullu",
      ruleLabel: "크툴루의 부름",
      cancelled: true,
    }),
  ).toBe("[크툴루의 부름] 21세기 바벨탑 [GM rullu] (취소됨)");
});

it("룰 분류가 비어 있으면 붙이지 않는다", () => {
  expect(recruitPostTitle({ title: "달그림자 여관", gmName: "새벽세시", ruleLabel: null })).toBe(
    "달그림자 여관 [GM 새벽세시]",
  );
});

it("100자를 넘으면 제목만 줄인다", () => {
  const result = recruitPostTitle({
    title: "가".repeat(200),
    gmName: "새벽세시",
    ruleLabel: "크툴루의 부름",
  });
  expect(result).toHaveLength(100);
  expect(result.startsWith("[크툴루의 부름] ")).toBe(true);
  expect(result.endsWith(" [GM 새벽세시]")).toBe(true);
});
