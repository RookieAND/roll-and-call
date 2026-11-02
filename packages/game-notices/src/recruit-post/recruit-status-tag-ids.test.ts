import { expect, it } from "vitest";

import { recruitStatusTagIds } from "./recruit-status-tag-ids";
import type { RecruitTarget } from "./recruit-target";

const target = (cancelled?: string): RecruitTarget => ({
  tags: {
    open: "o",
    closed: "c",
    cancelled,
    categories: { cat: "k" },
    playTypes: { voice: "v", text: "t" },
    briefing: "b",
    session: "s",
    adult: "a",
    managed: [],
  },
});

const session = { kind: "session", playType: "voice" } as const;

it("취소는 취소됨 태그를 쓰고, 연결하지 않았으면 마감 태그로 둔다", () => {
  const args = { closed: true, cancelled: true, categoryId: "cat", ...session };
  expect(recruitStatusTagIds({ target: target("x"), ...args })).toEqual(["x", "k", "s", "v"]);
  expect(recruitStatusTagIds({ target: target(), ...args })).toEqual(["c", "k", "s", "v"]);
  expect(
    recruitStatusTagIds({ target: target("x"), closed: false, categoryId: null, ...session }),
  ).toEqual(["o", "s", "v"]);
});

it("플레이 유형 태그와 구분 태그(설명회·세션)를 붙인다", () => {
  const args = { target: target(), closed: false, categoryId: "cat" };
  expect(recruitStatusTagIds({ ...args, kind: "session", playType: "text" })).toEqual([
    "o",
    "k",
    "s",
    "t",
  ]);
  expect(recruitStatusTagIds({ ...args, kind: "briefing", playType: "voice" })).toEqual([
    "o",
    "k",
    "b",
    "v",
  ]);
});

it("보이스·텍스트는 두 태그를 모두 달고, 5개를 넘으면 뒤에서 자른다", () => {
  const args = { target: target(), closed: false, kind: "session", playType: "both" } as const;
  expect(recruitStatusTagIds({ ...args, categoryId: null })).toEqual(["o", "s", "v", "t"]);
  expect(recruitStatusTagIds({ ...args, categoryId: "cat", adultOnly: true })).toEqual([
    "o",
    "k",
    "s",
    "a",
    "v",
  ]);
});

it("연결하지 않은 태그는 빼고 붙인다", () => {
  const bare: RecruitTarget = {
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

it("성인 전용 구인에만 성인 전용 태그를 붙인다", () => {
  const args = { target: target(), closed: false, categoryId: null, ...session };
  expect(recruitStatusTagIds({ ...args, adultOnly: true })).toEqual(["o", "s", "a", "v"]);
  expect(recruitStatusTagIds({ ...args, adultOnly: false })).toEqual(["o", "s", "v"]);
});
