import { describe, expect, it } from "vitest";

import { nextUncheckedShot } from "./next-unchecked-shot";

const order = ["front", "back", "extra1", "extra2"] as const;

describe("nextUncheckedShot", () => {
  it("앞 사진을 건너뛰고 마지막만 체크했어도 남은 앞 사진으로 돌아간다", () => {
    expect(nextUncheckedShot({ order, checked: ["extra2"], from: "extra2" })).toBe("front");
  });

  it("뒤쪽의 첫 미확인 사진으로 간다", () => {
    expect(nextUncheckedShot({ order, checked: ["front", "extra1"], from: "front" })).toBe("back");
  });

  it("모두 확인했으면 없다", () => {
    expect(nextUncheckedShot({ order, checked: [...order], from: "back" })).toBeUndefined();
  });

  it("현재 사진이 미확인이면 현재 사진이 마지막 후보다", () => {
    expect(nextUncheckedShot({ order, checked: ["front", "back", "extra1"], from: "extra2" })).toBe(
      "extra2",
    );
  });
});
