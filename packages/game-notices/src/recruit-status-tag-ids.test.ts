import { expect, it } from "vitest";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

const target = (cancelled?: string): RecruitTarget => ({
  forum: true,
  tags: {
    open: "o",
    closed: "c",
    cancelled,
    categories: { cat: "k" },
    playTypes: { voice: "v", text: "t" },
    briefing: "b",
    managed: [],
  },
});

const session = { kind: "session", playType: "voice" } as const;

it("취소는 취소됨 태그를 쓰고, 연결하지 않았으면 마감 태그로 둔다", () => {
  const args = { closed: true, cancelled: true, categoryId: "cat", ...session };
  expect(recruitStatusTagIds({ target: target("x"), ...args })).toEqual(["x", "k", "v"]);
  expect(recruitStatusTagIds({ target: target(), ...args })).toEqual(["c", "k", "v"]);
  expect(
    recruitStatusTagIds({ target: target("x"), closed: false, categoryId: null, ...session }),
  ).toEqual(["o", "v"]);
});

it("플레이 유형 태그를 붙이고, 설명회면 구분 태그를 더 붙인다", () => {
  const args = { target: target(), closed: false, categoryId: "cat" };
  expect(recruitStatusTagIds({ ...args, kind: "session", playType: "text" })).toEqual([
    "o",
    "k",
    "t",
  ]);
  expect(recruitStatusTagIds({ ...args, kind: "briefing", playType: "voice" })).toEqual([
    "o",
    "k",
    "v",
    "b",
  ]);
});

it("연결하지 않은 태그는 빼고 붙인다", () => {
  const bare: RecruitTarget = {
    forum: true,
    tags: { open: "o", categories: {}, playTypes: {}, managed: [] },
  };
  expect(
    recruitStatusTagIds({
      target: bare,
      closed: false,
      categoryId: null,
      kind: "briefing",
      playType: "voice",
    }),
  ).toEqual(["o"]);
});
