import { describe, expect, it } from "vitest";

import { parsePageSize } from "./parse-page-size";

describe("parsePageSize", () => {
  it("10, 20, 50만 받는다", () => {
    expect(parsePageSize("10")).toBe(10);
    expect(parsePageSize("20")).toBe(20);
    expect(parsePageSize("50")).toBe(50);
  });

  it("없거나 허용하지 않는 값은 10으로 둔다", () => {
    expect(parsePageSize(undefined)).toBe(10);
    expect(parsePageSize("")).toBe(10);
    expect(parsePageSize("15")).toBe(10);
    expect(parsePageSize("100")).toBe(10);
    expect(parsePageSize("-20")).toBe(10);
    expect(parsePageSize("abc")).toBe(10);
  });
});
