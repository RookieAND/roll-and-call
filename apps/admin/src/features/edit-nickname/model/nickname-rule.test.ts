import { describe, expect, it } from "vitest";

import { followsNicknameRule } from "./nickname-rule";
import { quoteWithDirection } from "./quote-with-direction";

describe("followsNicknameRule", () => {
  it("2~12자의 한글, 영문, 숫자만 허용한다", () => {
    expect(followsNicknameRule("모험가4821")).toBe(true);
    expect(followsNicknameRule("a")).toBe(false);
    expect(followsNicknameRule("가".repeat(13))).toBe(false);
    expect(followsNicknameRule("달빛 토끼")).toBe(false);
    expect(followsNicknameRule("운영진!")).toBe(false);
  });
});

describe("quoteWithDirection", () => {
  it("받침이 없거나 ㄹ이면 '로', 그 밖의 받침이면 '으로'를 붙인다", () => {
    expect(quoteWithDirection("모험가4821")).toBe("‘모험가4821’로");
    expect(quoteWithDirection("달빛운영자")).toBe("‘달빛운영자’로");
    expect(quoteWithDirection("하늘")).toBe("‘하늘’로");
    expect(quoteWithDirection("고양")).toBe("‘고양’으로");
  });
});
