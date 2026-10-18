import { describe, expect, it } from "vitest";

import { KICK_BLOCK, kickBlockCode } from "./kick-block-code";

const open = { serverOwner: false, staff: false, self: false };

describe("kickBlockCode", () => {
  it("막을 이유가 없으면 null", () => expect(kickBlockCode(open)).toBeNull());
  it("서버 소유자가 운영진보다 먼저", () =>
    expect(kickBlockCode({ ...open, serverOwner: true, staff: true })).toBe(
      KICK_BLOCK.serverOwner,
    ));
  it("운영진이나 본인이면 staff", () => {
    expect(kickBlockCode({ ...open, staff: true })).toBe(KICK_BLOCK.staff);
    expect(kickBlockCode({ ...open, self: true })).toBe(KICK_BLOCK.staff);
  });
});
