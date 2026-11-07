import { describe, expect, it } from "vitest";

import { filledLinks } from "./filled-links";

describe("filledLinks", () => {
  it("빈 칸을 빼고 앞뒤 공백을 지운다", () => {
    expect(filledLinks(["", " https://a.com ", "  "])).toEqual(["https://a.com"]);
  });
});
