import { describe, expect, it } from "vitest";

import { appliedRulebookLabel } from "./applied-rulebook-label";

describe("appliedRulebookLabel", () => {
  it("한 권이면 이름 그대로", () => {
    expect(appliedRulebookLabel({ rulebook: "D&D", groupBookCount: 0 })).toBe("D&D");
    expect(appliedRulebookLabel({ rulebook: "D&D", groupBookCount: 1 })).toBe("D&D");
  });
  it("묶음이면 첫 책 외 N권", () => {
    expect(appliedRulebookLabel({ rulebook: "D&D", groupBookCount: 12 })).toBe("D&D 외 11권");
  });
});
