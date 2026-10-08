import { describe, expect, it } from "vitest";

import { resolveRecruitTags } from "./resolve-recruit-tags";

const available = [
  { id: "1", name: "모집 중" },
  { id: "2", name: "마감" },
  { id: "3", name: "피아스코" },
];

describe("resolveRecruitTags", () => {
  it("저장한 태그가 없으면 공백을 무시한 이름으로 찾는다", () => {
    expect(resolveRecruitTags({ saved: null, available })).toMatchObject({
      open: "1",
      closed: "2",
    });
  });

  it("저장한 id가 포럼에 있으면 이름보다 먼저 쓴다", () => {
    const tags = resolveRecruitTags({
      saved: { open: "3", categories: { cat: "3" } },
      available,
    });
    expect(tags.open).toBe("3");
    expect(tags.categories).toEqual({ cat: "3" });
    expect(tags.managed.sort()).toEqual(["2", "3"]);
  });

  it("사라진 태그 id는 이름으로 찾거나 비운다", () => {
    const tags = resolveRecruitTags({
      saved: { open: "gone", categories: { cat: "gone" } },
      available,
    });
    expect(tags.open).toBe("1");
    expect(tags.categories).toEqual({});
  });

  it("플레이 유형·구분 태그는 저장한 id가 포럼에 있을 때만 쓰고 이름으로 찾지 않는다", () => {
    const tags = resolveRecruitTags({
      saved: { playTypes: { voice: "3", text: "gone" }, briefing: "gone" },
      available: [...available, { id: "4", name: "보이스" }],
    });
    expect(tags.playTypes).toEqual({ voice: "3", text: undefined });
    expect(tags.briefing).toBeUndefined();
    expect(tags.managed).toContain("3");
    expect(resolveRecruitTags({ saved: null, available }).playTypes).toEqual({});
  });
});
