import { expect, it } from "vitest";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

const target = (cancelled?: string): RecruitTarget => ({
  forum: true,
  tags: { open: "o", closed: "c", cancelled, categories: { cat: "k" }, managed: [] },
});

it("취소는 취소됨 태그를 쓰고, 연결하지 않았으면 마감 태그로 둔다", () => {
  const args = { closed: true, cancelled: true, categoryId: "cat" };
  expect(recruitStatusTagIds({ target: target("x"), ...args })).toEqual(["x", "k"]);
  expect(recruitStatusTagIds({ target: target(), ...args })).toEqual(["c", "k"]);
  expect(recruitStatusTagIds({ target: target("x"), closed: false, categoryId: null })).toEqual([
    "o",
  ]);
});
