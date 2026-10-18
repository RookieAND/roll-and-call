import { describe, expect, it } from "vitest";

import { isSanctioned } from "./is-sanctioned";

describe("isSanctioned", () => {
  const now = Date.parse("2026-10-05T00:00:00Z");
  it("제재가 없으면 false", () => expect(isSanctioned({}, now)).toBe(false));
  it("무기한이면 true", () => expect(isSanctioned({ sanction: { until: null } }, now)).toBe(true));
  it("기한 전이면 true, 지났으면 false", () => {
    expect(isSanctioned({ sanction: { until: new Date(now + 1) } }, now)).toBe(true);
    expect(isSanctioned({ sanction: { until: new Date(now) } }, now)).toBe(false);
  });
});
