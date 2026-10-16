import { describe, expect, it } from "vitest";

import { groupRulebooksByInitial } from "./group-rulebooks-by-initial";

describe("groupRulebooksByInitial", () => {
  it("한글 초성, 알파벳, 기타 순으로 묶고 쌍자음은 합친다", () => {
    const groups = groupRulebooksByInitial(
      ["크툴루의 부름", "까마귀", "가이아", "Fate", "2d6", "나이트"].map((label) => ({ label })),
    );
    expect(groups.map((group) => group.label)).toEqual(["ㄱ", "ㄴ", "ㅋ", "F", "기타"]);
    expect(groups[0]!.items.map((item) => item.label)).toEqual(["가이아", "까마귀"]);
  });
});
