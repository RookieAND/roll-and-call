import { describe, expect, it } from "vitest";

import { canManageStaffMemo } from "./can-manage-staff-memo";

describe("canManageStaffMemo", () => {
  it("쓴 사람과 소유자만 고치거나 지울 수 있다", () => {
    expect(canManageStaffMemo({ authorId: "a", actorId: "a", owner: false })).toBe(true);
    expect(canManageStaffMemo({ authorId: "a", actorId: "b", owner: true })).toBe(true);
    expect(canManageStaffMemo({ authorId: "a", actorId: "b", owner: false })).toBe(false);
    expect(canManageStaffMemo({ authorId: null, actorId: "b", owner: false })).toBe(false);
  });
});
