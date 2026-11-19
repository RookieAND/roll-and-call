import { describe, expect, it } from "vitest";

import { isSlotInRoundCoordination } from "./is-slot-in-round-coordination";
import { roundAvailabilityBlockReason } from "./round-availability-block-reason";

describe("isSlotInRoundCoordination", () => {
  const base = { start: "2026-12-01", end: "2026-12-07", windowStartHour: 20, windowEndHour: 2 };
  it("기간·시간대 안은 true, 밖은 false", () => {
    expect(isSlotInRoundCoordination({ ...base, slot: new Date("2026-12-01T11:00:00Z") })).toBe(
      true,
    );
    expect(isSlotInRoundCoordination({ ...base, slot: new Date("2026-12-01T03:00:00Z") })).toBe(
      false,
    );
    expect(isSlotInRoundCoordination({ ...base, slot: new Date("2026-12-09T11:00:00Z") })).toBe(
      false,
    );
  });
});

describe("roundAvailabilityBlockReason", () => {
  const coordination = { status: "coordinating", start: "2026-12-01", end: "2026-12-07" };
  it("기간 밖·비참여자·조율 아님을 막는다", () => {
    const now = new Date("2026-12-03T00:00:00Z");
    expect(roundAvailabilityBlockReason({ coordination, now, isMember: true })).toBeNull();
    expect(roundAvailabilityBlockReason({ coordination, now, isMember: false })).not.toBeNull();
    expect(
      roundAvailabilityBlockReason({
        coordination,
        now: new Date("2026-12-09T00:00:00Z"),
        isMember: true,
      }),
    ).not.toBeNull();
    expect(
      roundAvailabilityBlockReason({
        coordination: { ...coordination, status: "scheduled" },
        now,
        isMember: true,
      }),
    ).not.toBeNull();
  });
});
