import { describe, expect, it } from "vitest";

import { firstFreeNickname, nicknameBaseOf, suffixedNickname } from "./member-nickname";

describe("nicknameBaseOf", () => {
  it("앞뒤 공백을 지우고 연속 공백을 하나로 줄인다", () => {
    expect(nicknameBaseOf("  달빛   토끼 ")).toBe("달빛 토끼");
  });

  it("30자를 넘으면 앞 30자만 남긴다", () => {
    expect(nicknameBaseOf("가".repeat(35))).toBe("가".repeat(30));
  });

  it("이모지는 코드 포인트 하나로 센다", () => {
    expect(nicknameBaseOf("🐰".repeat(31))).toBe("🐰".repeat(30));
  });

  it("비어 있으면 null이다", () => {
    expect(nicknameBaseOf("   ")).toBeNull();
    expect(nicknameBaseOf(null)).toBeNull();
    expect(nicknameBaseOf(undefined)).toBeNull();
  });
});

describe("suffixedNickname", () => {
  it("n이 1이면 바탕 이름 그대로다", () => {
    expect(suffixedNickname("달빛토끼", 1)).toBe("달빛토끼");
  });

  it("30자 바탕에 2를 붙이면 30자다", () => {
    const nickname = suffixedNickname("가".repeat(30), 2);
    expect(nickname).toBe(`${"가".repeat(29)}2`);
    expect(Array.from(nickname)).toHaveLength(30);
  });

  it("n이 10이면 두 자리만큼 자른다", () => {
    expect(suffixedNickname("가".repeat(30), 10)).toBe(`${"가".repeat(28)}10`);
  });
});

describe("firstFreeNickname", () => {
  it("겹치지 않으면 그대로다", () => {
    expect(firstFreeNickname({ base: "달빛토끼", taken: new Set() })).toEqual({
      nickname: "달빛토끼",
      suffixed: false,
    });
  });

  it("대소문자를 무시하고 겹치는지 본다", () => {
    expect(firstFreeNickname({ base: "Rookie", taken: new Set(["rookie"]) })).toEqual({
      nickname: "Rookie2",
      suffixed: true,
    });
  });

  it("2가 있으면 3이다", () => {
    expect(
      firstFreeNickname({ base: "달빛토끼", taken: new Set(["달빛토끼", "달빛토끼2"]) }),
    ).toEqual({ nickname: "달빛토끼3", suffixed: true });
  });
});
