import { describe, expect, it } from "vitest";

import { isLinkServiceKey } from "./is-link-service-key";

describe("isLinkServiceKey", () => {
  it("accepts known keys only", () => {
    expect(isLinkServiceKey("youtube")).toBe(true);
    expect(isLinkServiceKey("unknown")).toBe(false);
  });
});
