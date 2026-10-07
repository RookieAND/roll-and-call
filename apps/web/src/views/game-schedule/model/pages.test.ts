import { chunk } from "es-toolkit";
import { describe, expect, it } from "vitest";

import { buildDayColumns } from "@/shared/lib";

import { DAYS_PER_PAGE } from "./days-per-page";
import { pageIndexOf } from "./page-index-of";

// 2026-09-10(목) ~ 09-22(화): 13일 → 4 / 4 / 4 / 1
const pages = chunk(
  buildDayColumns({ rangeStart: "2026-09-10", rangeEnd: "2026-09-22" }),
  DAYS_PER_PAGE,
);

describe("pages", () => {
  it("4일씩 끊는다", () => {
    expect(pages.map((page) => page.length)).toEqual([4, 4, 4, 1]);
  });
});

describe("pageIndexOf", () => {
  it("그 날짜가 든 페이지를 찾는다", () => {
    expect(pageIndexOf({ pages, date: "2026-09-19" })).toBe(2);
  });

  it("없는 날짜와 빈 값은 첫 페이지로 둔다", () => {
    expect(pageIndexOf({ pages, date: null })).toBe(0);
    expect(pageIndexOf({ pages, date: "2030-01-01" })).toBe(0);
  });
});
