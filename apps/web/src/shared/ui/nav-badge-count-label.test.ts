import { describe, expect, it } from "vitest";

import { navBadgeCountLabel } from "./nav-badge-count-label";

describe("navBadgeCountLabel", () => {
  it("99까지는 숫자 그대로, 넘으면 99+", () => {
    expect(navBadgeCountLabel(3)).toBe("3");
    expect(navBadgeCountLabel(99)).toBe("99");
    expect(navBadgeCountLabel(100)).toBe("99+");
  });
});
