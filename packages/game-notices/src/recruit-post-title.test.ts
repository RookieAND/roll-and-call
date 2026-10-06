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

it("100자를 넘으면 제목만 줄인다", () => {
  const result = recruitPostTitle({ title: "가".repeat(200), gmName: "새벽세시" });
  expect(result).toHaveLength(100);
  expect(result.endsWith(" [GM 새벽세시]")).toBe(true);
});
