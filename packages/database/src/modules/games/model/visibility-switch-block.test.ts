import { describe, expect, it } from "vitest";

import { visibilitySwitchBlock } from "./visibility-switch-block";

const now = new Date("2026-11-01T00:00:00Z");
const upcoming = {
  scheduleMode: "fixed" as const,
  confirmedAt: new Date("2026-11-02T00:00:00Z"),
  cancelledAt: null,
};

describe("visibilitySwitchBlock", () => {
  it("참여 행이 없는 시작 전 일시 지정형은 바꿀 수 있다", () => {
    expect(visibilitySwitchBlock({ game: upcoming, participantCount: 0, now })).toBe(null);
  });

  it("참여 행이 있으면 바꿀 수 없다", () => {
    expect(visibilitySwitchBlock({ game: upcoming, participantCount: 1, now })).toBe(
      "hasApplicants",
    );
  });

  it("조율형은 바꿀 수 없다", () => {
    const game = { ...upcoming, scheduleMode: "coordinate" as const, confirmedAt: null };
    expect(visibilitySwitchBlock({ game, participantCount: 0, now })).toBe("coordinate");
  });

  it("세션이 시작했거나 취소된 구인은 바꿀 수 없다", () => {
    const started = { ...upcoming, confirmedAt: new Date("2026-10-31T00:00:00Z") };
    expect(visibilitySwitchBlock({ game: started, participantCount: 0, now })).toBe("started");
    const cancelled = { ...upcoming, cancelledAt: now };
    expect(visibilitySwitchBlock({ game: cancelled, participantCount: 0, now })).toBe("cancelled");
  });
});
