import { describe, expect, it } from "vitest";

import { splitDotRows } from "./split-dot-rows";

describe("splitDotRows", () => {
  it.each([
    [1, [1]],
    [3, [3]],
    [4, [2, 2]],
    [5, [2, 3]],
    [6, [3, 3]],
    [7, [3, 4]],
    [8, [4, 4]],
  ])("%i개는 %j 줄로 나눈다", (count, sizes) => {
    const rows = splitDotRows(Array.from({ length: count }, (_, index) => index));
    expect(rows.map((row) => row.length)).toEqual(sizes);
  });
});
