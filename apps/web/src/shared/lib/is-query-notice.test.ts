import { describe, expect, it } from "vitest";

import { isQueryNotice } from "./is-query-notice";

describe("isQueryNotice", () => {
  it("accepts known notices only", () => {
    expect(isQueryNotice("no-draw-result")).toBe(true);
    expect(isQueryNotice("other")).toBe(false);
  });
});
