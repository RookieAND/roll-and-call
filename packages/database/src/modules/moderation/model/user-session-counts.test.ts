import { describe, expect, it } from "vitest";

import { playedCountsByUser, recentNoShowCountsByUser } from "./user-session-counts";

const now = new Date("2026-10-05T12:00:00Z");
const DAY = 86_400_000;
const daysAgo = (days: number) => new Date(now.getTime() - days * DAY);

const session = (id: string, memberIds: string[], overrides = {}) => ({
  id,
  memberIds,
  startsAt: daysAgo(10),
  endsAt: daysAgo(10),
  ...overrides,
});
const noShow = (sessionId: string, userId: string, cancelled = false) => ({
  userId,
  sessionId,
  cancelled,
});

describe("playedCountsByUser", () => {
  it("끝난 인정 세션만 세고 유효 불참·숨김·취소·진행 전은 뺀다", () => {
    const sessions = [
      session("done", ["a", "b"]),
      session("absent", ["a"]),
      session("absentCancelled", ["a"]),
      session("hidden", ["a"], { hidden: {} }),
      session("cancelled", ["a"], { cancelled: true }),
      session("future", ["a"], { endsAt: new Date(now.getTime() + DAY) }),
    ];
    const noShows = [noShow("absent", "a"), noShow("absentCancelled", "a", true)];
    const counts = playedCountsByUser({ sessions, noShows, now });
    expect(counts.get("a")).toBe(2);
    expect(counts.get("b")).toBe(1);
  });

  it("userIds를 주면 그 사람만 센다", () => {
    const counts = playedCountsByUser({
      sessions: [session("done", ["a", "b"])],
      noShows: [],
      now,
      userIds: ["b"],
    });
    expect([...counts.keys()]).toEqual(["b"]);
  });
});

describe("recentNoShowCountsByUser", () => {
  it("30일 안의 취소되지 않은 불참만 센다", () => {
    const sessions = [
      session("recent", [], { startsAt: daysAgo(10) }),
      session("old", [], { startsAt: daysAgo(40) }),
    ];
    const noShows = [
      noShow("recent", "a"),
      noShow("recent", "b", true),
      noShow("old", "a"),
      noShow("missing", "a"),
    ];
    const counts = recentNoShowCountsByUser({ sessions, noShows, now });
    expect(counts.get("a")).toBe(1);
    expect(counts.has("b")).toBe(false);
  });
});
