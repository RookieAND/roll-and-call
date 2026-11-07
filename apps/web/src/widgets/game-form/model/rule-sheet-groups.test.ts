import { describe, expect, it } from "vitest";

import {
  CERT_STATE,
  editionSets,
  RULE_GATE,
  type MyRulebook,
  type MyRulebooks,
} from "@/entities/rulebook";

import { ruleSheetGroups } from "./rule-sheet-groups";

const book = (id: string, overrides: Partial<MyRulebook>) =>
  ({
    id,
    name: id,
    label: id,
    shortName: id,
    aliases: [],
    categoryId: id,
    categoryName: id,
    edition: "",
    kind: "core",
    certRequired: true,
    state: null,
    stateAt: null,
    latestApplication: null,
    unlockedBy: null,
    ...overrides,
  }) as MyRulebook;

const data = () => {
  const rulebooks = [
    book("크툴루의 부름 7판", {
      categoryName: "크툴루의 부름",
      edition: "7판",
      aliases: ["CoC"],
      state: CERT_STATE.certified,
    }),
    book("사타스페", { certRequired: false }),
    book("인세인", {}),
    book("달그림자", { certRequired: false, homebrew: "shared" }),
    book("고양이 탐정", { certRequired: false, homebrew: "mine" }),
    book("별빛 항해", { certRequired: false, homebrew: "mine" }),
  ];
  return { rulebooks, sets: editionSets(rulebooks) } as MyRulebooks;
};

describe("ruleSheetGroups", () => {
  it("카테고리마다 묶고 이름 순으로 늘어놓는다", () => {
    const groups = ruleSheetGroups({
      data: data(),
      query: "",
    });
    expect(groups.map((group) => group.name)).toEqual([
      "내가 만든 룰",
      "사타스페",
      "인세인",
      "크툴루의 부름",
      "자작 룰",
    ]);
    expect(groups[0]!.options.map(({ set }) => set.label)).toEqual(["고양이 탐정", "별빛 항해"]);
    expect(groups[2]!.options.map(({ gate }) => gate.type)).toEqual([RULE_GATE.blocked]);
    expect(groups[4]!.options.map(({ gate }) => gate.type)).toEqual([RULE_GATE.open]);
  });

  it("다른 이름으로도 찾는다", () => {
    expect(ruleSheetGroups({ data: data(), query: "coc" })).toHaveLength(1);
  });

  it("검색하면 결과가 있는 그룹만 남는다", () => {
    expect(ruleSheetGroups({ data: data(), query: "달그" }).map((group) => group.name)).toEqual([
      "자작 룰",
    ]);
  });
});
