import { describe, expect, it } from "vitest";

import { paginate } from "./paginate";

describe("paginate", () => {
  const rows = Array.from({ length: 45 }, (_, index) => index);

  it("10행씩 자른다", () => {
    expect(paginate(rows, "5")).toEqual({ page: 5, totalPages: 5, rows: [40, 41, 42, 43, 44] });
  });

  it("없거나 벗어난 페이지는 끝으로 맞춘다", () => {
    expect(paginate(rows, undefined).page).toBe(1);
    expect(paginate(rows, "9").page).toBe(5);
    expect(paginate([], "2")).toEqual({ page: 1, totalPages: 1, rows: [] });
  });
});
