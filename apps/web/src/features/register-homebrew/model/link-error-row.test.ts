import { describe, expect, it } from "vitest";

import { linkErrorRow } from "./link-error-row";

describe("linkErrorRow", () => {
  it("형식이 틀린 첫 칸을 고른다", () => {
    expect(linkErrorRow(["https://a.com", "docs.google.com/document/d/9xK"])).toBe(1);
  });

  it("앞 칸과 겹치는 칸을 고르고 빈 칸은 건너뛴다", () => {
    expect(linkErrorRow(["https://a.com", "", "https://a.com"])).toBe(2);
  });

  it("고를 칸이 없으면 마지막 칸에 붙인다", () => {
    expect(linkErrorRow(["https://a.com", ""])).toBe(1);
  });
});
