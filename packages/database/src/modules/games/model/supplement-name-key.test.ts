import { describe, expect, it } from "vitest";

import { supplementNameKey } from "./supplement-name-key";

describe("supplementNameKey", () => {
  it("띄어쓰기와 대소문자를 무시한다", () => {
    expect(supplementNameKey(" 쿠라마 신류  유파북 ")).toBe(supplementNameKey("쿠라마신류유파북"));
    expect(supplementNameKey("Pulp Cthulhu")).toBe(supplementNameKey("pulpcthulhu"));
  });

  it("다른 이름은 다르게 본다", () => {
    expect(supplementNameKey("인비전")).not.toBe(supplementNameKey("인비젼"));
  });
});
