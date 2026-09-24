import { describe, expect, it } from "vitest";

import { withQuery } from "./with-query";

describe("withQuery", () => {
  it("바꾼 값만 덮고 빈 값은 지운다", () => {
    expect(withQuery("/cert", { q: "김", reapplied: "1" }, { reapplied: undefined })).toBe(
      "/cert?q=%EA%B9%80",
    );
    expect(withQuery("/cert", {}, {})).toBe("/cert");
    expect(withQuery("/cert/status", { tab: "gm" }, { unapplied: "1" })).toBe(
      "/cert/status?tab=gm&unapplied=1",
    );
  });
});
