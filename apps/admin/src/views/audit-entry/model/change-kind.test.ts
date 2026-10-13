import { describe, expect, it } from "vitest";

import { changeKind } from "./change-kind";

describe("changeKind", () => {
  it("앞 값이 없으면 추가다", () => {
    expect(changeKind({ after: "7판" })).toBe("added");
  });

  it("뒤 값이 없으면 삭제다", () => {
    expect(changeKind({ before: "7판" })).toBe("removed");
  });

  it("둘 다 있으면 변경이다", () => {
    expect(changeKind({ before: "6판", after: "7판" })).toBe("changed");
  });
});
