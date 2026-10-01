import { describe, expect, it } from "vitest";

import { swipeDirection } from "./swipe-direction";

describe("swipeDirection", () => {
  it("가로로 충분히 끌면 넘긴다", () => {
    expect(swipeDirection({ deltaX: -120, deltaY: 10 })).toBe("next");
    expect(swipeDirection({ deltaX: 120, deltaY: -10 })).toBe("previous");
  });

  it("짧게 튕긴 것과 세로로 끈 것은 넘김이 아니다", () => {
    expect(swipeDirection({ deltaX: -20, deltaY: 0 })).toBeNull();
    expect(swipeDirection({ deltaX: -80, deltaY: 140 })).toBeNull();
  });
});
