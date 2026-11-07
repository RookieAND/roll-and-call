import { describe, expect, it } from "vitest";

import { certApplyHref } from "./cert-apply-href";

describe("certApplyHref", () => {
  it("고른 책이 없으면 첫 단계를 건너뛰고 책 고르기로 간다", () => {
    expect(certApplyHref({ rulebookIds: [] })).toBe("/me/rulebooks/apply?step=books");
  });

  it("고른 책이 있으면 rulebook 쿼리만 붙인다", () => {
    expect(certApplyHref({ rulebookIds: ["a", "b"] })).toBe(
      "/me/rulebooks/apply?rulebook=a&rulebook=b",
    );
  });

  it("사진 단계는 책이 없어도 step을 붙이지 않는다", () => {
    expect(certApplyHref({ rulebookIds: [], step: "photos" })).toBe("/me/rulebooks/apply/photos");
  });
});
