import { describe, expect, it } from "vitest";

import { nextInList } from "./next-in-list";

describe("nextInList", () => {
  const ids = ["a", "b", "c"];

  it("다음 id를 돌려준다", () => {
    expect(nextInList({ ids, currentId: "a" })).toBe("b");
  });

  it("끝이면 null이다", () => {
    expect(nextInList({ ids, currentId: "c" })).toBeNull();
  });

  it("목록에 없으면 null이다", () => {
    expect(nextInList({ ids, currentId: "z" })).toBeNull();
  });
});
