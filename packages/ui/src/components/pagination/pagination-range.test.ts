import { describe, expect, it } from "vitest";

import { paginationRange } from "./pagination-range";

const E = "ellipsis";
const range = (page: number, totalPages: number, siblings = 1) =>
  paginationRange({ page, totalPages, siblings });

describe("paginationRange", () => {
  it("쪽이 적으면 전부 보여 준다", () => {
    expect(range(1, 1)).toEqual([1]);
    expect(range(3, 7)).toEqual([1, 2, 3, 4, 5, 6, 7]);
  });

  it("앞쪽에서는 앞을 펼치고 끝 쪽을 남긴다", () => {
    expect(range(1, 20)).toEqual([1, 2, 3, 4, 5, E, 20]);
    expect(range(4, 20)).toEqual([1, 2, 3, 4, 5, E, 20]);
  });

  it("가운데에서는 양쪽에 말줄임을 둔다", () => {
    expect(range(10, 20)).toEqual([1, E, 9, 10, 11, E, 20]);
  });

  it("뒤쪽에서는 뒤를 펼치고 첫 쪽을 남긴다", () => {
    expect(range(20, 20)).toEqual([1, E, 16, 17, 18, 19, 20]);
    expect(range(17, 20)).toEqual([1, E, 16, 17, 18, 19, 20]);
  });

  it("어느 자리에서든 칸 수가 같다", () => {
    for (let page = 1; page <= 20; page += 1) expect(range(page, 20)).toHaveLength(7);
    for (let page = 1; page <= 20; page += 1) expect(range(page, 20, 2)).toHaveLength(9);
  });
});
