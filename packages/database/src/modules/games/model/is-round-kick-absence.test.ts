import { describe, expect, it } from "vitest";

import { isRoundKickAbsence } from "./is-round-kick-absence";

const kicked = {
  status: "removed",
  absent: true,
  leftReason: "removed",
  absenceCancelledAt: null,
} as const;

describe("isRoundKickAbsence", () => {
  it("불참으로 내보낸 기록만 참이다", () => {
    expect(isRoundKickAbsence(kicked)).toBe(true);
    expect(isRoundKickAbsence({ ...kicked, leftReason: "mutual" })).toBe(false);
    expect(isRoundKickAbsence({ ...kicked, absenceCancelledAt: new Date() })).toBe(false);
    expect(isRoundKickAbsence({ ...kicked, status: "confirmed", leftReason: null })).toBe(false);
    expect(isRoundKickAbsence({ ...kicked, absent: false })).toBe(false);
  });
});
