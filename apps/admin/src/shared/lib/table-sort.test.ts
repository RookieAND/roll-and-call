import { describe, expect, it } from "vitest";

import { parseSort } from "./parse-sort";
import { sortHref } from "./sort-href";
import { sortRows } from "./sort-rows";

const columns = { joinedAt: "desc", nickname: "asc" } as const;
const fallback = { column: "joinedAt", dir: "desc" } as const;

interface Row {
  id: string;
  nickname: string;
  joinedAt: Date | null;
}

const rows: Row[] = [
  { id: "a", nickname: "하얀고래", joinedAt: new Date("2026-01-09") },
  { id: "b", nickname: "달빛토끼", joinedAt: null },
  { id: "c", nickname: "김코코", joinedAt: new Date("2025-03-02") },
  { id: "d", nickname: "탐정놀이중", joinedAt: new Date("2026-01-09") },
];
const accessors = {
  joinedAt: (row: Row) => row.joinedAt,
  nickname: (row: Row) => row.nickname,
};
const ids = (sorted: Row[]) => sorted.map((row) => row.id);

describe("parseSort", () => {
  it("주소의 열과 방향을 읽는다", () => {
    expect(
      parseSort({ searchParams: { sort: "nickname", dir: "desc" }, columns, fallback }),
    ).toEqual({ column: "nickname", dir: "desc", columns });
  });

  it("모르는 열이나 방향은 fallback이다", () => {
    expect(parseSort({ searchParams: { sort: "secret", dir: "asc" }, columns, fallback })).toEqual({
      ...fallback,
      columns,
    });
    expect(
      parseSort({ searchParams: { sort: "nickname", dir: "sideways" }, columns, fallback }),
    ).toEqual({ ...fallback, columns });
    expect(parseSort({ searchParams: {}, columns, fallback })).toEqual({ ...fallback, columns });
  });
});

describe("sortRows", () => {
  it("날짜는 큰 값부터, 같은 값은 기본 순서, 빈 값은 맨 아래다", () => {
    expect(ids(sortRows({ rows, sort: { column: "joinedAt", dir: "desc" }, accessors }))).toEqual([
      "a",
      "d",
      "c",
      "b",
    ]);
  });

  it("반대 방향에서도 빈 값은 맨 아래이고 같은 값은 기본 순서다", () => {
    expect(ids(sortRows({ rows, sort: { column: "joinedAt", dir: "asc" }, accessors }))).toEqual([
      "c",
      "a",
      "d",
      "b",
    ]);
  });

  it("이름은 가나다순이다", () => {
    expect(ids(sortRows({ rows, sort: { column: "nickname", dir: "asc" }, accessors }))).toEqual([
      "c",
      "b",
      "d",
      "a",
    ]);
  });
});

describe("sortHref", () => {
  const sort = { column: "joinedAt", dir: "desc", columns } as const;

  it("다른 열을 누르면 그 열의 처음 방향이다", () => {
    expect(sortHref({ href: "/trpia/users", sort, column: "nickname" })).toBe(
      "/trpia/users?sort=nickname&dir=asc",
    );
  });

  it("같은 열을 다시 누르면 방향을 뒤집는다", () => {
    expect(sortHref({ href: "/trpia/users", sort, column: "joinedAt" })).toBe(
      "/trpia/users?sort=joinedAt&dir=asc",
    );
  });

  it("page를 지우고 필터·검색어는 남긴다", () => {
    expect(
      sortHref({ href: "/trpia/users?q=김&status=sanctioned&page=3", sort, column: "nickname" }),
    ).toBe("/trpia/users?q=%EA%B9%80&status=sanctioned&sort=nickname&dir=asc");
  });
});
