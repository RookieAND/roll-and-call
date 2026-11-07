import { describe, expect, it } from "vitest";

import type { EditionSet, MyRulebook } from "@/entities/rulebook";

import { ownedCategorySub } from "./owned-category-sub";

const nearest = (edition: string) => ({
  set: { edition } as EditionSet,
  missing: [{} as MyRulebook],
});

describe("ownedCategorySub", () => {
  it("열 수 있는 판본을 보인다", () => {
    expect(
      ownedCategorySub({ hasEarned: true, editions: ["7판", "6판"], nearest: undefined }),
    ).toBe("7판 · 6판 구인을 열 수 있습니다");
    expect(ownedCategorySub({ hasEarned: true, editions: [], nearest: undefined })).toBe(
      "구인을 열 수 있습니다",
    );
  });

  it("남은 기본 룰북 권수와 판본을 보인다", () => {
    expect(ownedCategorySub({ hasEarned: false, editions: [], nearest: nearest("3rd") })).toBe(
      "기본 룰북 1권을 더 인증하면 3rd 구인을 열 수 있습니다",
    );
    expect(ownedCategorySub({ hasEarned: false, editions: [], nearest: nearest("") })).toBe(
      "기본 룰북 1권을 더 인증하면 구인을 열 수 있습니다",
    );
    expect(ownedCategorySub({ hasEarned: false, editions: [], nearest: undefined })).toBe(
      "기본 룰북을 인증하면 GM이 될 수 있습니다",
    );
  });
});
