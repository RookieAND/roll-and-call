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
    session: "s",
    managed: [],
  },
});

const session = { kind: "session", playType: "voice" } as const;

it("취소는 취소됨 태그를 쓰고, 연결하지 않았으면 마감 태그로 둔다", () => {
  const args = { closed: true, cancelled: true, categoryId: "cat", ...session };
  expect(recruitStatusTagIds({ target: target("x"), ...args })).toEqual(["x", "k", "v", "s"]);
  expect(recruitStatusTagIds({ target: target(), ...args })).toEqual(["c", "k", "v", "s"]);
  expect(
    recruitStatusTagIds({ target: target("x"), closed: false, categoryId: null, ...session }),
  ).toEqual(["o", "v", "s"]);
});

it("플레이 유형 태그와 구분 태그(설명회·세션)를 붙인다", () => {
  const args = { target: target(), closed: false, categoryId: "cat" };
  expect(recruitStatusTagIds({ ...args, kind: "session", playType: "text" })).toEqual([
    "o",
    "k",
    "t",
    "s",
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
