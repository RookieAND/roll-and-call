import { describe, expect, it } from "vitest";

import { paginate } from "./paginate";

describe("paginate", () => {
  const rows = Array.from({ length: 45 }, (_, index) => index);

  it("10행씩 자른다", () => {
    expect(paginate(rows, "5")).toEqual({ page: 5, totalPages: 5, rows: [40, 41, 42, 43, 44] });
    expect(paginate(rows, "3").rows).toEqual([20, 21, 22, 23, 24, 25, 26, 27, 28, 29]);
  });

  it("쪽 크기를 바꾸면 그 크기로 자르고 쪽 수를 다시 센다", () => {
    expect(paginate(rows, "1", 20)).toMatchObject({ page: 1, totalPages: 3 });
    expect(paginate(rows, "3", 20).rows).toEqual([40, 41, 42, 43, 44]);
    expect(paginate(rows, "1", 50)).toMatchObject({ page: 1, totalPages: 1 });
    expect(paginate(rows, "1", 50).rows).toHaveLength(45);
  });

  it("쪽 크기를 키워 쪽 수가 줄면 벗어난 페이지를 끝으로 맞춘다", () => {
    expect(paginate(rows, "5", 20).page).toBe(3);
    expect(paginate(rows, "5", 50).page).toBe(1);
  });

  it("없거나 벗어난 페이지는 끝으로 맞춘다", () => {
    expect(paginate(rows, undefined).page).toBe(1);
    expect(paginate(rows, "9").page).toBe(5);
    expect(paginate([], "2")).toEqual({ page: 1, totalPages: 1, rows: [] });
  });
});
