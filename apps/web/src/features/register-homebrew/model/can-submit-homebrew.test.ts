import { describe, expect, it } from "vitest";

import { canSubmitHomebrew } from "./can-submit-homebrew";

const base = { name: "달그림자 연대기", summary: "미스터리 룰입니다.", links: [""], imageCount: 0 };

describe("canSubmitHomebrew", () => {
  it("링크나 이미지가 하나도 없으면 막는다", () => {
    expect(canSubmitHomebrew(base)).toBe(false);
    expect(canSubmitHomebrew({ ...base, links: ["https://a.com"] })).toBe(true);
    expect(canSubmitHomebrew({ ...base, imageCount: 1 })).toBe(true);
  });

  it("이름과 소개는 공백만으로 채울 수 없다", () => {
    expect(canSubmitHomebrew({ ...base, name: "  ", imageCount: 1 })).toBe(false);
    expect(canSubmitHomebrew({ ...base, summary: "", imageCount: 1 })).toBe(false);
  });
});
