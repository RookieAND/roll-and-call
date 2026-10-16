import { describe, expect, it } from "vitest";

import { normalizeAccentColor } from "./accent-color";

describe("normalizeAccentColor", () => {
  it("대문자 #RRGGBB로 맞추고, 비우면 null, 틀리면 undefined", () => {
    expect(normalizeAccentColor(" #4f46e5 ")).toBe("#4F46E5"); // tokens-check-ignore: 사용자 입력 예시
    expect(normalizeAccentColor("")).toBeNull();
    expect(normalizeAccentColor("4f46e5")).toBeUndefined();
    expect(normalizeAccentColor("#fff")).toBeUndefined();
  });
});
