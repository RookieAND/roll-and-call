import { describe, expect, it } from "vitest";

import { PARTICIPANT_STATUS, RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { CERT_STATE, type MyRulebook } from "@/entities/rulebook";

import { buildSessions } from "./build-sessions";
import { listTodos } from "./list-todos";
import type { SessionGame } from "./session-card-model";
import { TODO_KIND } from "./todo-kind";

const NOW = new Date("2026-09-15T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const HOUR = 60 * 60 * 1000;
const at = (days: number) => new Date(NOW.getTime() + days * DAY);

const confirmed = (userId: string) => ({
  userId,
  status: PARTICIPANT_STATUS.confirmed,
  joinedAt: at(-10),
  absent: false,
});
const waiting = (userId: string) => ({ ...confirmed(userId), status: PARTICIPANT_STATUS.waiting });

function game(partial: Partial<SessionGame>): SessionGame {
  return {
    id: "g",
    gmId: "me",
    title: "제목",
    maxPlayers: 4,
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    endedAt: null,
    cancelledAt: null,
    endDate: at(3),
    waitlistEnabled: true,
    recruitMethod: RECRUIT_METHOD.firstCome,
    drawnAt: null,
    playMinutes: 180,
    attendanceConfirmedAt: null,
    gm: { username: "GM", avatarUrl: null },
    participants: [],
    ...partial,
  } as unknown as SessionGame;
}

function rejected(id: string, stateAt: Date): MyRulebook {
  return {
    id,
    label: `룰북 ${id}`,
    state: CERT_STATE.rejected,
    stateAt,
    latestApplication: null,
  } as unknown as MyRulebook;
}

function todos({
  hosted = [],
  joined = [],
  rulebooks = [],
}: {
  hosted?: SessionGame[];
  joined?: SessionGame[];
  rulebooks?: MyRulebook[];
}) {
  const sessions = buildSessions({
    hosted,
    joined,
    viewerId: "me",
    respondedGameIds: new Set(),
    responseCounts: new Map(),
    now: NOW,
  });
  return listTodos({ sessions, rejectedRulebooks: rulebooks, now: NOW });
}

const awaitingTime = (id: string, endDate = at(-1)) =>
  game({ id, endDate, participants: [confirmed("a")] });
const attendance = (id: string, confirmedAt = at(-0.5)) =>
  game({ id, confirmedAt, participants: [confirmed("a")] });
const vacancy = (id: string, partial: Partial<SessionGame> = {}) =>
  game({ id, participants: [confirmed("a"), waiting("b")], ...partial });
const availability = (id: string, endDate = at(3)) =>
  game({ id, gmId: "gm", endDate, participants: [confirmed("me")] });

describe("listTodos", () => {
  it("다섯 종류가 정해진 순서로 온다", () => {
    const result = todos({
      hosted: [vacancy("vacancy"), attendance("attendance"), awaitingTime("time")],
      joined: [availability("availability")],
      rulebooks: [rejected("r", at(-1))],
    });
    expect(result.items.map((item) => item.kind)).toEqual([
      TODO_KIND.confirmTime,
      TODO_KIND.confirmAttendance,
      TODO_KIND.fillVacancy,
      TODO_KIND.submitAvailability,
      TODO_KIND.certRejected,
    ]);
    expect(result.count).toBe(5);
    expect(result.items.map((item) => item.eyebrow)).toEqual([
      "세션 일시 미정",
      "출석 확인 · 자동 처리 D-1",
      "빈자리 생김",
      "가능 시간 미제출",
      "인증 반려",
    ]);
  });

  it("같은 종류 안에서는 가까운 것이 먼저다", () => {
    const result = todos({
      hosted: [
        vacancy("later", { endDate: at(5) }),
        vacancy("sooner", { endDate: at(2) }),
        attendance("old", at(-0.7)),
        attendance("recent", at(-0.4)),
        awaitingTime("time-recent", at(-1)),
        awaitingTime("time-old", at(-3)),
      ],
      joined: [availability("far", at(6)), availability("near", at(1))],
      rulebooks: [rejected("new", at(-1)), rejected("old", at(-3))],
    });
    expect(
      result.items.map((item) => (item.type === "session" ? item.gameId : item.rulebookId)),
    ).toEqual([
      "time-old",
      "time-recent",
      "old",
      "recent",
      "sooner",
      "later",
      "near",
      "far",
      "old",
      "new",
    ]);
  });

  it("세션 일시 미정은 마감 7일 뒤에 내린다", () => {
    expect(todos({ hosted: [awaitingTime("g", at(-7))] }).count).toBe(0);
    const almost = new Date(NOW.getTime() - 7 * DAY + HOUR);
    expect(todos({ hosted: [awaitingTime("g", almost)] }).count).toBe(1);
  });

  it("인증 반려는 반려 7일 뒤에 내린다", () => {
    expect(todos({ rulebooks: [rejected("r", at(-7))] }).count).toBe(0);
    const almost = new Date(NOW.getTime() - 7 * DAY + HOUR);
    expect(todos({ rulebooks: [rejected("r", almost)] }).count).toBe(1);
  });

  it("취소된 구인에는 어느 할 일도 없다", () => {
    const cancelledAt = at(-1);
    const result = todos({
      hosted: [
        { ...awaitingTime("time"), cancelledAt },
        { ...attendance("attendance"), cancelledAt },
        { ...vacancy("vacancy"), cancelledAt },
      ],
      joined: [{ ...availability("availability"), cancelledAt }],
    });
    expect(result.count).toBe(0);
  });

  it("빈자리는 대기자·빈자리가 있고, 추첨 뒤이고, 세션이 끝나기 전에만", () => {
    const full = [confirmed("a"), confirmed("b"), waiting("c")];
    const result = todos({
      hosted: [
        game({ id: "no-waiting", participants: [confirmed("a")] }),
        game({ id: "no-seat", maxPlayers: 2, participants: full }),
        vacancy("before-draw", { recruitMethod: RECRUIT_METHOD.lottery, drawnAt: null }),
        vacancy("ended", { confirmedAt: at(-1) }),
        vacancy("in-progress", { confirmedAt: new Date(NOW.getTime() - HOUR) }),
      ],
    });
    const vacancies = result.items.filter((item) => item.kind === TODO_KIND.fillVacancy);
    expect(vacancies.map((item) => (item.type === "session" ? item.gameId : null))).toEqual([
      "in-progress",
    ]);
  });

  it("막힘은 세션 일시 미정이 있을 때만", () => {
    expect(todos({ hosted: [vacancy("g"), attendance("a")] }).blocked).toBe(false);
    expect(todos({ hosted: [awaitingTime("g")] }).blocked).toBe(true);
  });
});
