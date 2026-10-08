import { describe, expect, it } from "vitest";

import { toRulebookFields } from "./to-rulebook-fields";

describe("toRulebookFields", () => {
  it("다른 이름을 쉼표로 나누고 빈 칸·중복을 뺀다", () => {
    expect(
      toRulebookFields({
        name: " 황혼선서 ",
        edition: "",
        category: " 마기카로기아 ",
        categoryAlias: "",
        kind: "supplement",
        supersedesId: "6",
        aliasesText: "황혼, 선서,, 황혼 ",
        certRequired: false,
      }),
    ).toEqual({
      name: "황혼선서",
      edition: "",
      category: "마기카로기아",
      categoryAlias: null,
      kind: "supplement",
      supersedesId: null,
      aliases: ["황혼", "선서"],
      certRequired: false,
    });
  });

  it("카테고리를 비우면 룰북 이름을 카테고리로 쓴다", () => {
    const draft = {
      name: "팀 셜록",
      edition: "",
      category: " ",
      categoryAlias: "",
      kind: "core" as const,
      supersedesId: null,
      aliasesText: "",
      certRequired: true,
    };
    expect(toRulebookFields(draft).category).toBe("팀 셜록");
  });

  it("카테고리 약어는 기본 룰북일 때만 남기고 빈 칸은 null로 둔다", () => {
    const draft = {
      name: "거점방어 TRPG 좀비라인",
      edition: "",
      category: "",
      categoryAlias: " 좀비라인 ",
      kind: "core" as const,
      supersedesId: null,
      aliasesText: "",
      certRequired: true,
    };
    expect(toRulebookFields(draft).categoryAlias).toBe("좀비라인");
    expect(toRulebookFields({ ...draft, categoryAlias: "좀비라인, 좀라" }).categoryAlias).toBe(
      "좀비라인",
    );
    expect(
      toRulebookFields({ ...draft, categoryAlias: "가".repeat(20) }).categoryAlias,
    ).toHaveLength(12);
    expect(toRulebookFields({ ...draft, categoryAlias: " " }).categoryAlias).toBeNull();
    expect(toRulebookFields({ ...draft, kind: "supplement" }).categoryAlias).toBeNull();
  });
});
