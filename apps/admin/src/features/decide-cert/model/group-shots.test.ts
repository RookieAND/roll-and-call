import { describe, expect, it } from "vitest";

import { groupShots } from "./group-shots";

describe("groupShots", () => {
  it("올라온 사진만 올린 순서대로 사진 번호를 붙인다", () => {
    const shots = groupShots({ front: "a", back: "b", extra2: "c" });
    expect(shots.map((shot) => [shot.key, shot.label])).toEqual([
      ["front", "사진 1"],
      ["back", "사진 2"],
      ["extra2", "사진 3"],
    ]);
  });

  it("한 장만 올렸으면 한 장만 보인다", () => {
    expect(groupShots({ front: "a" })).toHaveLength(1);
  });
});
