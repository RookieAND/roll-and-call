import { describe, expect, it } from "vitest";

import type { EditionSet, MyRulebook } from "@/entities/rulebook";

import { ownedCategorySub } from "./owned-category-sub";

const nearest = (label: string) => ({
  set: { label } as EditionSet,
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

  it("남은 권수와 카테고리·판본을 보인다", () => {
    expect(
      ownedCategorySub({ hasEarned: false, editions: [], nearest: nearest("더블크로스 3rd") }),
    ).toBe("1권만 더 인증하면 더블크로스 3rd GM이 될 수 있습니다");
    expect(ownedCategorySub({ hasEarned: false, editions: [], nearest: nearest("인세인") })).toBe(
      "1권만 더 인증하면 인세인 GM이 될 수 있습니다",
    );
    expect(ownedCategorySub({ hasEarned: false, editions: [], nearest: undefined })).toBe(
      "기본 룰북을 인증하면 GM이 될 수 있습니다",
    );
  });
});
