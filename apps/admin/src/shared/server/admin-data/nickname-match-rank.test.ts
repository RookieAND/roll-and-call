import { describe, expect, it } from "vitest";

import { nicknameMatchRank } from "./nickname-match-rank";

describe("nicknameMatchRank", () => {
  it("정확히 같음 → 앞부분 → 부분 순이고 대소문자를 무시한다", () => {
    expect(nicknameMatchRank({ nickname: "Kimcoco", keyword: "kimcoco" })).toBe(0);
    expect(nicknameMatchRank({ nickname: "김코딩", keyword: "김코" })).toBe(1);
    expect(nicknameMatchRank({ nickname: "새김코", keyword: "김코" })).toBe(2);
    expect(nicknameMatchRank({ nickname: "달빛토끼", keyword: "김코" })).toBeUndefined();
  });
});
