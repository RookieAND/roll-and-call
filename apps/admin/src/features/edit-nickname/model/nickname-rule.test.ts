import { describe, expect, it } from "vitest";

import { followsNicknameRule } from "./nickname-rule";

describe("followsNicknameRule", () => {
  it("2~12자의 한글, 영문, 숫자만 허용한다", () => {
    expect(followsNicknameRule("모험가4821")).toBe(true);
    expect(followsNicknameRule("a")).toBe(false);
    expect(followsNicknameRule("가".repeat(13))).toBe(false);
    expect(followsNicknameRule("달빛 토끼")).toBe(false);
    expect(followsNicknameRule("운영진!")).toBe(false);
  });
});
