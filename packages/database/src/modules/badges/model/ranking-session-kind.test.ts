import { describe, expect, it } from "vitest";

import { rankingSessionKind } from "./ranking-session-kind";

const kind = (input: Partial<Parameters<typeof rankingSessionKind>[0]>) =>
  rankingSessionKind({
    confirmedAttendeeCount: 4,
    rulebookMiniRule: false,
    hasRulebook: true,
    ...input,
  });

describe("rankingSessionKind", () => {
  it("정식", () => expect(kind({})).toBe("regular"));
  it("미니룰 분류", () => expect(kind({ rulebookMiniRule: true })).toBe("mini"));
  it("룰북 없는 구인은 미니룰", () => expect(kind({ hasRulebook: false })).toBe("mini"));
  it("실제 참석 1명이면 타이만", () => expect(kind({ confirmedAttendeeCount: 1 })).toBe("tieman"));
  it("타이만이 미니룰보다 우선한다", () => {
    expect(kind({ confirmedAttendeeCount: 1, rulebookMiniRule: true, hasRulebook: false })).toBe(
      "tieman",
    );
  });
});
