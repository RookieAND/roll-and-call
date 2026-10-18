import { describe, expect, it } from "vitest";

import {
  addedChanges,
  compactChanges,
  listChange,
  removedChanges,
  scalarChange,
} from "./audit-changes";

describe("scalarChange", () => {
  it("같은 값이면 null이다", () => {
    expect(scalarChange("분류", "코스믹", "코스믹")).toBeNull();
    expect(scalarChange("분류", "", undefined)).toBeNull();
  });

  it("앞 값이 비면 추가, 뒤 값이 비면 삭제, 둘 다 있으면 변경이다", () => {
    expect(scalarChange("약어", null, "코스믹")).toEqual({
      field: "약어",
      before: undefined,
      after: "코스믹",
    });
    expect(scalarChange("약어", "코스믹", "  ")).toEqual({
      field: "약어",
      before: "코스믹",
      after: undefined,
    });
    expect(scalarChange("판본", "6판", "7판")).toEqual({
      field: "판본",
      before: "6판",
      after: "7판",
    });
  });
});

describe("listChange", () => {
  it("순서만 바뀌면 null이다", () => {
    expect(listChange("다른 이름", ["a", "b"], ["b", "a"])).toBeNull();
  });

  it("늘거나 줄어든 항목만 남긴다", () => {
    expect(listChange("다른 이름", ["a", "b"], ["b", "c"])).toEqual({
      field: "다른 이름",
      added: ["c"],
      removed: ["a"],
    });
    expect(listChange("다른 이름", [], ["a"])).toEqual({ field: "다른 이름", added: ["a"] });
  });
});

describe("addedChanges·removedChanges", () => {
  it("빈 값은 건너뛴다", () => {
    expect(
      addedChanges([
        ["분류", "코스믹"],
        ["약어", ""],
      ]),
    ).toEqual([{ field: "분류", before: undefined, after: "코스믹" }]);
    expect(removedChanges([["약어", "코스믹"]])).toEqual([
      { field: "약어", before: "코스믹", after: undefined },
    ]);
  });
});

describe("compactChanges", () => {
  it("null을 걸러낸다", () => {
    expect(compactChanges([null, { field: "a", after: "b" }, null])).toEqual([
      { field: "a", after: "b" },
    ]);
  });
});
