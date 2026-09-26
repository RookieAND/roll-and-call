import { describe, expect, it } from "vitest";

import {
  CERT_STATE,
  editionSets,
  RULE_GATE,
  type MyRulebook,
  type MyRulebooks,
} from "@/entities/rulebook";

import { ruleSheetGroups } from "./rule-sheet-groups";

const NOW = new Date("2026-10-20T12:00:00+09:00");

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

const data = (enforcementDate: Date | null) => {
  const rulebooks = [
    book("크툴루의 부름 7판", {
      categoryName: "크툴루의 부름",
      edition: "7판",
      aliases: ["CoC"],
      state: CERT_STATE.certified,
    }),
    book("사타스페", { certRequired: false }),
    book("인세인", {}),
  ];
  return { rulebooks, sets: editionSets(rulebooks), enforcementDate } as MyRulebooks;
};

describe("ruleSheetGroups", () => {
  it("인증한 룰, 무료 배포 룰, 인증이 필요한 룰로 나눈다", () => {
    const groups = ruleSheetGroups(data(new Date("2026-10-01T00:00:00+09:00")), "", NOW);
    expect(groups.mine.map(({ set }) => set.label)).toEqual(["크툴루의 부름 7판"]);
    expect(groups.free.map(({ set }) => set.label)).toEqual(["사타스페"]);
    expect(groups.needed.map(({ set, gate }) => [set.label, gate.type])).toEqual([
      ["인세인", RULE_GATE.blocked],
    ]);
  });

  it("다른 이름으로도 찾는다", () => {
    expect(ruleSheetGroups(data(null), "coc", NOW).mine).toHaveLength(1);
  });
});
