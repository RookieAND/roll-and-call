import { describe, expect, it } from "vitest";

import type { UserSearchResult } from "@/shared/server";

import { buildSearchGroups } from "./build-search-groups";
import { shortcutHrefs } from "./shortcut-hrefs";

const user = (id: string, nickname: string): UserSearchResult => ({
  id,
  nickname,
  playedCount: 3,
  recentNoShowCount: 0,
  noShows: [],
  certApplications: [],
  sessions: [],
});

const labels = (groups: ReturnType<typeof buildSearchGroups>) => groups.map((group) => group.label);

describe("buildSearchGroups", () => {
  const kimcoding = user("1", "김코딩");
  const kimcoco = user("2", "김코코");

  it("여러 명이 맞으면 처리 묶음을 붙이지 않는다", () => {
    const groups = buildSearchGroups({ query: "김코", users: [kimcoding, kimcoco], owner: true });
    expect(labels(groups)).toEqual(["유저"]);
  });

  it("닉네임이 정확히 같으면 그 사람에게만 처리 묶음을 붙인다", () => {
    const groups = buildSearchGroups({
      query: "김코딩",
      users: [kimcoding, user("3", "김코딩2")],
      owner: true,
    });
    expect(labels(groups)).toEqual(["유저", "김코딩에 대한 처리"]);
  });

  it("맞는 유저가 1명이면 처리 묶음을 붙이고 「유저 상세 열기」는 유저 상세로 간다", () => {
    const [, actions] = buildSearchGroups({ query: "코딩", users: [kimcoding], owner: true });
    expect(actions?.items.at(-1)).toMatchObject({ title: "유저 상세 열기", href: "/users/1" });
  });

  it("화면 이동은 소유자 전용 메뉴를 거르고 후기 메뉴를 찾는다", () => {
    expect(buildSearchGroups({ query: "설정", users: [], owner: false })).toEqual([]);
    expect(buildSearchGroups({ query: "설정", users: [], owner: true })).toHaveLength(1);
    const [screens] = buildSearchGroups({ query: "후기", users: [], owner: false });
    expect(screens?.items.map((item) => item.href)).toEqual(["/reviews"]);
  });
});

describe("shortcutHrefs", () => {
  it("G C는 가장 오래 기다린 신청 상세, G B는 추가 요청, G R은 후기이고 G P는 없다", () => {
    const hrefs = shortcutHrefs([
      { kind: "cert", count: 2, oldestDays: 5, oldestId: "app-9" },
      { kind: "rulebookRequest", count: 1, oldestDays: 1, oldestId: null },
    ]);
    expect(hrefs).toEqual({ C: "/cert/app-9", B: "/rules?tab=requests", R: "/reviews" });
    expect(hrefs.P).toBeUndefined();
  });
});
