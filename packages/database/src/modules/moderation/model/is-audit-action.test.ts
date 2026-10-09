import { describe, expect, it } from "vitest";

import { isAuditAction } from "./is-audit-action";

describe("isAuditAction", () => {
  it("accepts filter actions and legacy actions", () => {
    expect(isAuditAction("제재")).toBe(true);
    expect(isAuditAction("안내 DM")).toBe(true);
  });

  it("rejects unknown and renamed-away names", () => {
    expect(isAuditAction("설정 변경")).toBe(false);
    expect(isAuditAction("")).toBe(false);
  });
});
