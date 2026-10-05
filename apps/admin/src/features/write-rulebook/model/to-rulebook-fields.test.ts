import { describe, expect, it } from "vitest";

import { toRulebookFields } from "./to-rulebook-fields";

describe("toRulebookFields", () => {
  it("다른 이름을 쉼표로 나누고 빈 칸·중복을 뺀다", () => {
    expect(
      toRulebookFields({
        name: " 황혼선서 ",
        edition: "",
        category: " 마기카로기아 ",
        kind: "supplement",
        supersedesId: "6",
        aliasesText: "황혼, 선서,, 황혼 ",
        certRequired: false,
      }),
    ).toEqual({
      name: "황혼선서",
      edition: "",
      category: "마기카로기아",
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
      kind: "core" as const,
      supersedesId: null,
      aliasesText: "",
      certRequired: true,
    };
    expect(toRulebookFields(draft).category).toBe("팀 셜록");
  });
});
