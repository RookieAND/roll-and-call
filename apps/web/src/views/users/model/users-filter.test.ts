import { describe, expect, it } from "vitest";

import { parseUsersFilter } from "./parse-users-filter";
import { usersFilterCount } from "./users-filter-count";
import { usersHref } from "./users-href";

describe("parseUsersFilter", () => {
  it("값이 없으면 기본값", () => {
    expect(parseUsersFilter({})).toEqual({
      q: undefined,
      cert: undefined,
      host: undefined,
      recruiting: false,
      sort: "recent",
    });
  });

  it("공백은 없는 값, recruiting은 1만 켠다, 모르는 정렬은 기본", () => {
    const filter = parseUsersFilter({ q: "  ", cert: " abc ", recruiting: "true", sort: "x" });
    expect(filter).toMatchObject({ q: undefined, cert: "abc", recruiting: false, sort: "recent" });
    expect(parseUsersFilter({ recruiting: "1", sort: "name" })).toMatchObject({
      recruiting: true,
      sort: "name",
    });
  });
});

describe("usersHref", () => {
  const base = parseUsersFilter({});

  it("기본 정렬과 1쪽은 주소에서 뺀다", () => {
    expect(usersHref(base)).toBe("/users");
    expect(usersHref(base, 1)).toBe("/users");
    expect(usersHref({ ...base, sort: "name" }, 3)).toBe("/users?sort=name&page=3");
  });

  it("조건을 모두 담는다", () => {
    expect(usersHref({ ...base, q: "루키", cert: "a", host: "b", recruiting: true })).toBe(
      `/users?q=${encodeURIComponent("루키")}&cert=a&host=b&recruiting=1`,
    );
  });
});

describe("usersFilterCount", () => {
  it("룰북·룰·모집 조건만 센다", () => {
    expect(usersFilterCount({ ...parseUsersFilter({}), q: "x" })).toBe(0);
    expect(usersFilterCount(parseUsersFilter({ cert: "a", recruiting: "1" }))).toBe(2);
  });
});
