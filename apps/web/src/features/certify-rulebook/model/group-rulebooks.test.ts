import { describe, expect, it } from "vitest";

import type { MyRulebook } from "@/entities/rulebook";

import { groupRulebooks } from "./group-rulebooks";

const rulebook = (name: string, edition: string, aliases: string[] = []) =>
  ({
    id: name + edition,
    name,
    edition,
    aliases,
    label: `${name} ${edition}`.trim(),
  }) as MyRulebook;

const LIST = [
  rulebook("크툴루의 부름", "7판", ["CoC"]),
  rulebook("크툴루의 부름", "6판"),
  rulebook("인세인", ""),
];

describe("groupRulebooks", () => {
  it("이름으로 묶는다", () => {
    expect(groupRulebooks(LIST, "").map((group) => [group.name, group.editions.length])).toEqual([
      ["크툴루의 부름", 2],
      ["인세인", 1],
    ]);
  });

  it("다른 이름·판본으로도 찾는다", () => {
    expect(groupRulebooks(LIST, "coc")[0]!.editions.map((item) => item.edition)).toEqual(["7판"]);
    expect(groupRulebooks(LIST, "6판")[0]!.editions).toHaveLength(1);
    expect(groupRulebooks(LIST, "없는 룰")).toEqual([]);
  });
});
