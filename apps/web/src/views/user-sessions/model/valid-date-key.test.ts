import { describe, expect, it } from "vitest";

import { validDateKey } from "./valid-date-key";

describe("validDateKey", () => {
  it("달력에 있는 날짜만 돌려준다", () => {
    expect(validDateKey("2026-11-24")).toBe("2026-11-24");
    expect(validDateKey("2026-02-30")).toBeUndefined();
    expect(validDateKey("abc")).toBeUndefined();
    expect(validDateKey(undefined)).toBeUndefined();
  });
});
