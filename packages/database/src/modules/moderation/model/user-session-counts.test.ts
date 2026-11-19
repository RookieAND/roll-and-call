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

describe("다회차 구인", () => {
  const round = (daysAgoEnd: number, attendeeIds: string[]) => ({
    endsAt: daysAgo(daysAgoEnd),
    attendeeIds,
  });
  const multi = (overrides = {}) =>
    session("multi", ["a", "b"], {
      roundCount: 4,
      confirmedRounds: [
        round(40, ["a", "b"]),
        round(30, ["a", "b"]),
        round(20, ["a"]),
        round(10, ["a"]),
      ],
      endsAt: daysAgo(40),
      ...overrides,
    });

  it("구인이 끝나지 않아도 끝난 회차에 참석한 만큼 센다", () => {
    const counts = playedCountsByUser({ sessions: [multi()], noShows: [], now });
    expect(counts.get("a")).toBe(4);
    expect(counts.get("b")).toBe(2);
  });

  it("아직 안 끝난 회차와 취소·숨김 구인은 세지 않는다", () => {
    const ongoing = multi({ confirmedRounds: [round(1, ["a"]), round(-3, ["a"])] });
    expect(playedCountsByUser({ sessions: [ongoing], noShows: [], now }).get("a")).toBe(1);
    expect(
      playedCountsByUser({ sessions: [multi({ cancelled: true })], noShows: [], now }).size,
    ).toBe(0);
    expect(playedCountsByUser({ sessions: [multi({ hidden: {} })], noShows: [], now }).size).toBe(
      0,
    );
  });

  it("내보내거나 하차한 사람도 앞서 참석한 회차는 남는다", () => {
    const sessions = [multi({ confirmedRounds: [round(40, ["k"]), round(30, ["k"])] })];
    const noShows = [{ ...noShow("multi", "k"), absenceAt: daysAgo(25) }];
    expect(playedCountsByUser({ sessions, noShows, now }).get("k")).toBe(2);
  });

  it("회차를 놓치고 남은 사람은 불참 0건이다", () => {
    expect(
      recentNoShowCountsByUser({ sessions: [multi()], noShows: [], now, userIds: ["a"] }).get("a"),
    ).toBe(undefined);
  });

  it("내보낸 불참은 1건이고 30일은 absenceAt부터 센다", () => {
    const sessions = [multi({ startsAt: daysAgo(60) })];
    const kicked = (absenceAt: Date) => [{ ...noShow("multi", "k"), absenceAt }];
    const count = (absenceAt: Date) =>
      recentNoShowCountsByUser({ sessions, noShows: kicked(absenceAt), now }).get("k");
    expect(count(daysAgo(29))).toBe(1);
    expect(count(daysAgo(31))).toBe(undefined);
  });
});
