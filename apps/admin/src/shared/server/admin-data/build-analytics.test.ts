import { sessionEndAt } from "@roll-and-call/database/games/model";
import { describe, expect, it } from "vitest";

import { buildAnalytics } from "./build-analytics";
import { POST_STATUS } from "./post-status";
import type { NoShow, Session } from "./types";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;
// 2026-10-05(월) 서울 12시.
const now = new Date("2026-10-05T03:00:00Z");
const ago = (days: number) => new Date(now.getTime() - days * DAY);

let sequence = 0;
function session(overrides: Partial<Session> & { startsAt: Date }): Session {
  sequence += 1;
  const startsAt = overrides.startsAt;
  return {
    id: `s${sequence}`,
    title: "세션",
    rulebook: "룰북",
    rulebookId: null,
    gmId: "gm",
    timeFixed: true,
    memberIds: ["a"],
    capacity: 4,
    closed: true,
    recruitStatus: POST_STATUS.ended,
    createdAt: ago(60),
    recruitDeadline: ago(40),
    recruitMethod: "선착순",
    endsAt: sessionEndAt({ confirmedAt: startsAt, playMinutes: null, endedAt: null }),
    ...overrides,
  };
}

function noShow(sessionId: string, userId: string, cancelled = false): NoShow {
  return { id: `${sessionId}:${userId}`, sessionId, userId, recordedAt: now, cancelled };
}

function build(sessions: Session[], noShows: NoShow[] = []) {
  return buildAnalytics({ sessions, noShows, users: [], previewEarly: false, now });
}

describe("buildAnalytics", () => {
  it("확정자 0명·숨김·취소 구인은 진행된 세션에서 빠지고, 진행 시간이 비면 시작 3시간 뒤부터 센다", () => {
    const sessions = [
      session({ startsAt: ago(3) }),
      session({ startsAt: ago(3), memberIds: [] }),
      session({ startsAt: ago(3), hidden: { reason: "", by: "", at: now } }),
      session({ startsAt: ago(3), cancelled: true }),
      session({ startsAt: new Date(now.getTime() - 2 * HOUR) }),
      session({ startsAt: new Date(now.getTime() - 4 * HOUR) }),
    ];
    expect(build(sessions).summary.finishedSessions.value).toBe(2);
  });

  it("불참자는 참여한 사람에서 빠지고, 출석 확정 전 세션 좌석은 불참률 분모에서 빠진다", () => {
    const confirmed = session({
      startsAt: ago(3),
      memberIds: ["a", "b", "c", "d"],
      attendanceConfirmedAt: ago(2),
    });
    const unconfirmed = session({ startsAt: ago(2), memberIds: ["e", "f"] });
    const data = build(
      [confirmed, unconfirmed],
      [noShow(confirmed.id, "a"), noShow(confirmed.id, "b", true)],
    );
    expect(data.summary.participants.value).toBe(5);
    expect(data.summary.noShowRate.value).toBe(25);
  });

  it("출석 확정된 세션이 없으면 불참률은 null이다", () => {
    expect(build([session({ startsAt: ago(3) })]).summary.noShowRate.value).toBeNull();
  });

  it("직전 28일 진행된 세션이 0건이면 compare가 false이고 지난 값이 null이다", () => {
    const data = build(Array.from({ length: 50 }, () => session({ startsAt: ago(3) })));
    expect(data.early).toBe(false);
    expect(data.compare).toBe(false);
    expect(data.summary.finishedSessions.previous).toBeNull();
  });

  it("직전 28일에 진행된 세션이 있으면 compare가 true다", () => {
    const sessions = [
      ...Array.from({ length: 50 }, () => session({ startsAt: ago(3) })),
      session({ startsAt: ago(40) }),
    ];
    const data = build(sessions);
    expect(data.compare).toBe(true);
    expect(data.summary.finishedSessions.previous).toBe(1);
  });

  it("첫 참여자는 최근 28일 안에 처음 참여한 사람이고 비율 분모는 같은 28일 참여한 사람이다", () => {
    const old = session({ startsAt: ago(40), memberIds: ["a"] });
    const recent = session({ startsAt: ago(5), memberIds: ["a", "b", "c", "d"] });
    const absentOnly = session({ startsAt: ago(60), memberIds: ["c"] });
    const data = build(
      [old, recent, absentOnly],
      [noShow(absentOnly.id, "c"), noShow(recent.id, "d")],
    );
    expect(data.firstTimers).toBe(2);
    expect(data.firstShare).toBe(67);
  });

  it("모집 중 수·룰북·모집 방식은 시간이 정해진 예정 세션만 센다", () => {
    const upcoming = { closed: false, endsAt: null, recruitStatus: POST_STATUS.confirmed };
    const sessions = [
      session({ ...upcoming, startsAt: new Date(now.getTime() + DAY), rulebook: "가" }),
      session({
        ...upcoming,
        startsAt: new Date(now.getTime() + 2 * DAY),
        rulebook: "가",
        recruitMethod: "추첨",
      }),
      session({
        ...upcoming,
        startsAt: new Date(now.getTime() + 3 * DAY),
        timeFixed: false,
        recruitStatus: POST_STATUS.recruiting,
        rulebook: "나",
      }),
      session({
        ...upcoming,
        startsAt: new Date(now.getTime() + 3 * DAY),
        cancelled: true,
        rulebook: "다",
      }),
    ];
    const data = build(sessions);
    const gridTotal = data.grid.open.flat().reduce((sum, count) => sum + count, 0);
    expect(data.openSessionCount).toBe(2);
    expect(gridTotal).toBe(2);
    expect(data.rulebooks.open).toEqual([{ name: "가", count: 2 }]);
    expect(data.firstComeShare.open).toBe(50);
  });
});
