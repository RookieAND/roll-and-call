import { describe, expect, it } from "vitest";

import { auditLogHref } from "./audit-log-href";

describe("auditLogHref", () => {
  it("ID가 있으면 ID로, 없으면 이름으로 거른다", () => {
    expect(auditLogHref({ targetUserId: "u", target: "김코코" })).toBe("/log?targetUser=u");
    expect(auditLogHref({ targetUserId: "u", targetGameId: "g" })).toBe(
      "/log?targetUser=u&targetGame=g",
    );
    expect(auditLogHref({ target: "인세인" })).toBe(`/log?target=${encodeURIComponent("인세인")}`);
  });
});
