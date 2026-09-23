import { describe, expect, it } from "vitest";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  SESSION_ROLE,
} from "@/entities/game";

import { buildProfileSessions } from "./build-profile-sessions";
import { buildSessions } from "./build-sessions";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
  type SessionGame,
} from "./session-card-model";
import { toSessionCard } from "./to-session-card";

const NOW = new Date("2026-09-15T12:00:00+09:00");
const DAY = 24 * 60 * 60 * 1000;
const at = (days: number) => new Date(NOW.getTime() + days * DAY);

function game(partial: Partial<SessionGame>): SessionGame {
  return {
    id: "g",
    gmId: "gm",
    title: "제목",
    rule: "CoC",
    maxPlayers: 4,
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    endDate: at(3),
    rangeStart: "2026-09-20",
    rangeEnd: "2026-09-24",
    waitlistEnabled: true,
    recruitMethod: RECRUIT_METHOD.firstCome,
    drawnAt: null,
    playMinutes: 180,
    attendanceConfirmedAt: null,
    gm: { username: "한랑아", avatarUrl: null },
    participants: [],
    ...partial,
  } as unknown as SessionGame;
}

const me = (status: ParticipantStatus) => ({
  userId: "me",
  status,
  joinedAt: at(-1),
  absent: false,
});
const other = {
  userId: "a",
  status: PARTICIPANT_STATUS.confirmed,
  joinedAt: at(-10),
  absent: false,
};
const confirmedMe = me(PARTICIPANT_STATUS.confirmed);
const context = (responded: string[] = []) => ({
  viewerId: "me",
  respondedGameIds: new Set(responded),
  responseCounts: new Map<string, number>(),
  now: NOW,
});
const playerCard = (partial: Partial<SessionGame>, responded: string[] = []) =>
  toSessionCard(game(partial), SESSION_ROLE.player, context(responded));
const hostCard = (partial: Partial<SessionGame>) =>
  toSessionCard(game(partial), SESSION_ROLE.host, context());

describe("참여 카드", () => {
  it("가능 시간을 내지 않았으면 막힌 카드로 칠하고 일정 조율이 할 일로 남는다", () => {
    const card = playerCard({ participants: [confirmedMe] });
    expect(card.chip).toBe(SESSION_CHIP.scheduling);
    expect(card.urgent).toBe(true);
    expect(card.scheduleIcon).toBe(SESSION_ICON.alert);
    expect(card.todo?.label).toBe("일정 조율");
    expect(card.schedule).toMatch(/까지 가능 시간을 내야 합니다$/);
  });

  it("가능 시간을 내면 할 일이 사라진다", () => {
    expect(playerCard({ participants: [confirmedMe] }, ["g"]).todo).toBeNull();
  });

  it("시간이 정해지면 언제인지가 앞에 온다", () => {
    const card = playerCard({ confirmedAt: at(2), endDate: at(-1), participants: [confirmedMe] });
    expect(card.chip).toBe(SESSION_CHIP.confirmed);
    expect(card.scheduleIcon).toBe(SESSION_ICON.calendar);
    expect(card.schedule).toMatch(/ · 모레$/);
  });
});

describe("대기 카드", () => {
  it("배지로만 갈리고 버튼은 대기 취소 하나다", () => {
    const card = playerCard({ participants: [other, me(PARTICIPANT_STATUS.waiting)] });
    expect(card.chip).toBe(SESSION_CHIP.waiting);
    expect(card.badge).toBe("승인 대기");
    expect(card.badgeColor).toBe("gray");
    expect(card.action?.label).toBe("대기 취소");
    expect(card.schedule).toBe("신청한 지 2일째입니다 · GM이 아직 보지 않았습니다");
  });

  it("추첨은 뽑기 전까지 순번이 없어 신청으로 센다", () => {
    const card = playerCard({
      recruitMethod: RECRUIT_METHOD.lottery,
      participants: [other, me(PARTICIPANT_STATUS.waiting)],
    });
    expect(card.badge).toBe("추첨 전");
    expect(card.badgeColor).toBe("gray");
    expect(card.waitlistRank).toBeNull();
    expect(card.action?.label).toBe("신청 취소");
  });

  it("참여 탭 카드에는 GM 줄이 붙는다", () => {
    expect(playerCard({}).gm?.username).toBe("한랑아");
  });
});

describe("운영 카드", () => {
  it("기한이 지났는데 시간이 없으면 무산이 아니라 조율 중인 GM 할 일이다", () => {
    const card = hostCard({ endDate: at(-1), participants: [other] });
    expect(card.chip).toBe(SESSION_CHIP.scheduling);
    expect(card.todo?.label).toBe("세션 시간 정하기");
    expect(card.urgent).toBe(true);
    expect(card.action?.label).toBe("운영 관리");
  });

  it("끝난 세션에는 출석 확인이 할 일로 남고, 카드 버튼은 운영 관리 하나다", () => {
    const card = hostCard({ id: "ended", confirmedAt: at(-1), participants: [confirmedMe, other] });
    expect(card.todo?.kind).toBe(SESSION_ACTION_KIND.confirmAttendance);
    expect(card.todo?.lines).toHaveLength(2);
    expect(card.action?.href).toBe("/games/ended/manage");
  });

  it("출석을 확정한 뒤에도 운영 관리로 들어가 고칠 수 있다", () => {
    const card = hostCard({
      id: "ended",
      confirmedAt: at(-1),
      attendanceConfirmedAt: at(-1),
      participants: [confirmedMe, other],
    });
    expect(card.todo).toBeNull();
    expect(card.action?.href).toBe("/games/ended/manage");
  });
});

describe("종료 카드", () => {
  it("완료 · 무산 · 대기 종료로 갈린다", () => {
    expect(playerCard({ confirmedAt: at(-1), participants: [confirmedMe] }).badge).toBe("완료");
    expect(hostCard({ endDate: at(-1), participants: [] }).badge).toBe("무산");
    expect(
      playerCard({
        confirmedAt: at(-1),
        participants: [other, me(PARTICIPANT_STATUS.waiting)],
      }).badge,
    ).toBe("대기 종료");
  });

  it("출석을 확정하기 전에는 불참이 아직 없다", () => {
    expect(playerCard({ confirmedAt: at(-1), participants: [confirmedMe, other] }).badge).toBe(
      "완료",
    );
  });

  it("확정한 뒤에야 불참이 기록으로 남는다", () => {
    const card = playerCard({
      confirmedAt: at(-1),
      attendanceConfirmedAt: at(-1),
      participants: [{ ...confirmedMe, absent: true }, other],
    });
    expect(card.badge).toBe("불참");
    expect(card.titleDanger).toBe(true);
    expect(card.scheduleIcon).toBe(SESSION_ICON.calendar);
    expect(card.schedule).toMatch(/ · 참석하지 않았습니다/);
  });

  it("시작했어도 플레이타임이 남아 있으면 종료가 아니다", () => {
    const running = playerCard({
      confirmedAt: new Date(NOW.getTime() - 60 * 60 * 1000),
      playMinutes: 360,
      participants: [confirmedMe],
    });
    expect(running.chip).not.toBe(SESSION_CHIP.ended);
  });
});

describe("buildSessions", () => {
  it("역할로만 가르고, 진행 중이 먼저 · 종료는 최근 것부터 뒤에 온다", () => {
    const sessions = buildSessions({
      hosted: [game({ id: "hosted-done", confirmedAt: at(-2), participants: [other] })],
      joined: [
        game({ id: "old", confirmedAt: at(-5), participants: [confirmedMe] }),
        game({ id: "recent", confirmedAt: at(-1), participants: [confirmedMe] }),
        game({ id: "later", endDate: at(6), participants: [confirmedMe] }),
        game({ id: "sooner", endDate: at(2), participants: [confirmedMe] }),
      ],
      ...context(),
    });
    expect(sessions[SESSION_ROLE.player].map((item) => item.id)).toEqual([
      "sooner",
      "later",
      "recent",
      "old",
    ]);
    expect(sessions[SESSION_ROLE.host].map((item) => item.id)).toEqual(["hosted-done"]);
  });
});

describe("buildProfileSessions", () => {
  const profile = buildProfileSessions({
    hosted: [game({ id: "hosted-done", confirmedAt: at(-2), participants: [other] })],
    joined: [
      game({ id: "waiting", participants: [other, me(PARTICIPANT_STATUS.waiting)] }),
      game({ id: "upcoming", participants: [confirmedMe] }),
      game({ id: "played", confirmedAt: at(-1), participants: [confirmedMe] }),
    ],
    userId: "me",
    now: NOW,
  });

  it("대기 중인 신청은 남의 프로필에 나오지 않는다", () => {
    expect(profile[SESSION_ROLE.player].map((item) => item.id)).toEqual(["upcoming", "played"]);
  });

  it("보는 사람 기준 문구와 할 일 버튼을 뺀 기록만 남는다", () => {
    const upcoming = profile[SESSION_ROLE.player][0]!;
    expect(upcoming.action).toBeNull();
    expect(upcoming.urgent).toBe(false);
    expect(upcoming.schedule).not.toMatch(/미제출/);
    expect(profile[SESSION_ROLE.host]).toHaveLength(1);
    expect(profile[SESSION_ROLE.host][0]?.action).toBeNull();
  });
});
