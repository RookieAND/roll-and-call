import { describe, expect, it } from "vitest";

import { coordinationPhase } from "./coordination-phase";
import { pendingNamesText } from "./pending-names-text";
import { periodText } from "./period-text";
import { remainingText } from "./remaining-text";
import { roundCandidateLine } from "./round-candidate";

describe("coordinationPhase", () => {
  it("조율 중이고 마감일까지는 open, 지나면 ended, 조율 중이 아니면 idle", () => {
    expect(
      coordinationPhase({ status: "coordinating", end: "2026-10-30", today: "2026-10-30" }),
    ).toBe("open");
    expect(
      coordinationPhase({ status: "coordinating", end: "2026-10-30", today: "2026-10-31" }),
    ).toBe("ended");
    expect(coordinationPhase({ status: "scheduled", end: "2026-10-30", today: "2026-10-28" })).toBe(
      "idle",
    );
    expect(coordinationPhase({ status: null, end: null, today: "2026-10-28" })).toBe("idle");
  });
});

describe("remainingText", () => {
  it("남은 일수와 당일", () => {
    expect(remainingText({ end: "2026-10-30", today: "2026-10-28" })).toBe(
      "마감까지 2일 남았습니다",
    );
    expect(remainingText({ end: "2026-10-30", today: "2026-10-30" })).toBe("오늘 마감입니다");
  });
});

describe("periodText", () => {
  it("월 일 ~ 월 일", () => {
    expect(periodText({ start: "2026-10-24", end: "2026-10-30" })).toBe("10월 24일 ~ 10월 30일");
  });
});

describe("pendingNamesText", () => {
  it("5명까지 나열하고 넘으면 외 n명", () => {
    expect(pendingNamesText(["가", "나"])).toBe("가, 나");
    expect(pendingNamesText(["a", "b", "c", "d", "e", "f", "g"])).toBe("a, b, c, d, e 외 2명");
  });
});

describe("roundCandidateLine", () => {
  const span = {
    startsAt: new Date("2026-10-31T12:00:00+09:00"),
    endsAt: new Date("2026-10-31T16:00:00+09:00"),
  };
  it("모두 가능과 n명 가능", () => {
    expect(roundCandidateLine({ ...span, memberCount: 5, totalCount: 5 })).toBe(
      "10월 31일 (토) 오후 12:00~4:00 · 5명 모두 가능",
    );
    expect(roundCandidateLine({ ...span, memberCount: 3, totalCount: 5 })).toContain("· 3명 가능");
  });
});
