import { describe, expect, it } from "vitest";

import { swipeDirection } from "./swipe-direction";

describe("swipeDirection", () => {
  it("가로로 충분히 끌면 넘긴다", () => {
    expect(swipeDirection(-120, 10)).toBe("next");
    expect(swipeDirection(120, -10)).toBe("previous");
  });

  it("짧게 튕긴 것과 세로로 끈 것은 넘김이 아니다", () => {
    expect(swipeDirection(-20, 0)).toBeNull();
    expect(swipeDirection(-80, 140)).toBeNull();
  });
});
