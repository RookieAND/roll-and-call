import { describe, expect, it } from "vitest";

import { parsePageSize } from "./parse-page-size";

describe("parsePageSize", () => {
  it("20, 50, 100만 받는다", () => {
    expect(parsePageSize("20")).toBe(20);
    expect(parsePageSize("50")).toBe(50);
    expect(parsePageSize("100")).toBe(100);
  });

  it("없거나 허용하지 않는 값은 20으로 둔다", () => {
    expect(parsePageSize(undefined)).toBe(20);
    expect(parsePageSize("")).toBe(20);
    expect(parsePageSize("15")).toBe(20);
    expect(parsePageSize("10")).toBe(20);
    expect(parsePageSize("-20")).toBe(20);
    expect(parsePageSize("abc")).toBe(20);
  });
});
