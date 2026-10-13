import { describe, expect, it } from "vitest";

import { paginate } from "./paginate";

describe("paginate", () => {
  const rows = Array.from({ length: 85 }, (_, index) => index);

  it("20행씩 자른다", () => {
    expect(paginate(rows, "5")).toEqual({ page: 5, totalPages: 5, rows: [80, 81, 82, 83, 84] });
    expect(paginate(rows, "3").rows).toEqual(Array.from({ length: 20 }, (_, index) => 40 + index));
  });

  it("쪽 크기를 바꾸면 그 크기로 자르고 쪽 수를 다시 센다", () => {
    expect(paginate(rows, "1", 50)).toMatchObject({ page: 1, totalPages: 2 });
    expect(paginate(rows, "2", 50).rows).toHaveLength(35);
    expect(paginate(rows, "1", 100)).toMatchObject({ page: 1, totalPages: 1 });
    expect(paginate(rows, "1", 100).rows).toHaveLength(85);
  });

  it("쪽 크기를 키워 쪽 수가 줄면 벗어난 페이지를 끝으로 맞춘다", () => {
    expect(paginate(rows, "5", 50).page).toBe(2);
    expect(paginate(rows, "5", 100).page).toBe(1);
  });

  it("없거나 벗어난 페이지는 끝으로 맞춘다", () => {
    expect(paginate(rows, undefined).page).toBe(1);
    expect(paginate(rows, "9").page).toBe(5);
    expect(paginate([], "2")).toEqual({ page: 1, totalPages: 1, rows: [] });
  });
});
