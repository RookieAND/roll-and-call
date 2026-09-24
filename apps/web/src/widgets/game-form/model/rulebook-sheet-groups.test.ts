import { describe, expect, it } from "vitest";

import { CERT_STATE, type MyRulebook, type MyRulebooks } from "@/entities/rulebook";

import { rulebookSheetGroups } from "./rulebook-sheet-groups";

const NOW = new Date("2026-10-20T12:00:00+09:00");
const rulebook = (
  label: string,
  state: MyRulebook["state"],
  certRequired = true,
  aliases: string[] = [],
) => ({ id: label, label, name: label, edition: "", aliases, state, certRequired }) as MyRulebook;

const data = (enforcementDate: Date | null): MyRulebooks => ({
  enforcementDate,
  requests: [],
  rulebooks: [
    rulebook("크툴루의 부름 7판", CERT_STATE.certified, true, ["CoC"]),
    rulebook("사타스페", null, false),
    rulebook("인세인", CERT_STATE.pending),
  ],
});

describe("rulebookSheetGroups", () => {
  it("적용일이 지나면 인증이 필요한 룰북은 못 고른다", () => {
    const groups = rulebookSheetGroups(data(new Date("2026-10-01T00:00:00+09:00")), "", NOW);
    expect(groups.mine.map((option) => option.pickable)).toEqual([true]);
    expect(groups.free.map((option) => option.pickable)).toEqual([true]);
    expect(groups.needed.map((option) => option.pickable)).toEqual([false]);
  });

  it("안내 기간에는 모두 고를 수 있고, 다른 이름으로도 찾는다", () => {
    expect(rulebookSheetGroups(data(null), "", NOW).needed[0]!.pickable).toBe(true);
    const found = rulebookSheetGroups(data(null), "coc", NOW);
    expect([found.mine.length, found.free.length, found.needed.length]).toEqual([1, 0, 0]);
  });
});
