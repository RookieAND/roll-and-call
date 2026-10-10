import { describe, expect, it } from "vitest";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  SESSION_ROLE,
  type SessionRole,
} from "@/entities/game";

import { buildProfileSessions } from "./build-profile-sessions";
import { buildSessions } from "./build-sessions";
import {
  SESSION_ACTION_KIND,
  SESSION_CHIP,
  SESSION_ICON,
  SESSION_TONE,
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
    endedAt: null,
    cancelledAt: null,
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
  toSessionCard({ game: game(partial), role: SESSION_ROLE.player, context: context(responded) });
const hostCard = (partial: Partial<SessionGame>) =>
  toSessionCard({ game: game(partial), role: SESSION_ROLE.host, context: context() });

describe("참여 카드", () => {
  it("가능 시간을 내지 않았으면 막힌 카드로 칠하고 일정 조율이 할 일로 남는다", () => {
    const card = playerCard({ participants: [confirmedMe] });
    expect(card.chip).toBe(SESSION_CHIP.scheduling);
    expect(card.urgent).toBe(true);
    expect(card.scheduleIcon).toBe(SESSION_ICON.alert);
    expect(card.todo?.label).toBe("일정 조율");
    expect(card.schedule).toMatch(/까지 조율 격자에 일정을 설정해야 합니다$/);
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
  it("선착순 대기는 마감 전에도 대기 N번이고 버튼은 대기 취소 하나다", () => {
    const card = playerCard({ participants: [other, me(PARTICIPANT_STATUS.waiting)] });
    expect(card.chip).toBe(SESSION_CHIP.waiting);
    expect(card.badge).toBe("대기 1번");
    expect(card.badgeColor).toBe("warning");
    expect(card.action?.label).toBe("대기 취소");
    expect(card.schedule).toBe("정원이 차 순서를 기다립니다 · 자리가 나면 알립니다");
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
    expect(card.schedule).toMatch(/신청 마감 · 마감 때 추첨합니다$/);
  });

  it("추첨 글 마감이 지나 아직 추첨 전이면 곧 추첨한다고 적는다", () => {
    const card = playerCard({
      recruitMethod: RECRUIT_METHOD.lottery,
      endDate: at(-1),
      participants: [other, me(PARTICIPANT_STATUS.waiting)],
    });
    expect(card.schedule).toBe("모집이 끝나 곧 추첨합니다");
    expect(card.action).toBeNull();
  });

  it("참여 탭 카드에는 GM 줄이 붙는다", () => {
    expect(playerCard({}).gm?.username).toBe("한랑아");
  });
});

describe("취소된 구인", () => {
  const cancelled = (partial: Partial<SessionGame>) =>
    ({ cancelledAt: at(-2), participants: [confirmedMe], ...partial }) as Partial<SessionGame>;

  it("두 탭 모두 흐린 취소됨 카드로 종료 칩에 남는다", () => {
    for (const card of [
      playerCard(cancelled({ cancelKind: "gm", cancelReason: "GM 사정" })),
      hostCard(cancelled({ cancelKind: "gm", cancelReason: "GM 사정" })),
    ]) {
      expect(card.chip).toBe(SESSION_CHIP.ended);
      expect(card.badge).toBe("취소됨");
      expect(card.badgeColor).toBe("gray");
      expect(card.cancelled).toBe(true);
      expect(card.action).toBeNull();
      expect(card.todo).toBeNull();
      expect(card.schedule).toBe("9월 13일 · GM 사정");
    }
  });

  it("예정 시각이 지난 뒤에도 대기자였던 사람의 취소됨 카드가 남는다", () => {
    const sessions = buildSessions({
      hosted: [],
      joined: [
        game({
          cancelledAt: at(-3),
          confirmedAt: at(-1),
          participants: [me(PARTICIPANT_STATUS.waiting)],
        }),
      ],
      ...context(),
    });
    expect(sessions[SESSION_ROLE.player].map((card) => card.badge)).toEqual(["취소됨"]);
  });

  it("운영진·자동 취소 문구, 사유 없는 GM 취소는 날짜만", () => {
    expect(playerCard(cancelled({ cancelKind: "staff" })).schedule).toBe(
      "9월 13일 · 운영진이 취소한 구인입니다",
    );
    expect(playerCard(cancelled({ cancelKind: "auto" })).schedule).toBe(
      "9월 13일 · GM이 서버를 나가 취소되었습니다",
    );
    expect(hostCard(cancelled({ cancelKind: "gm", cancelReason: null })).schedule).toBe("9월 13일");
  });
});

describe("운영 카드 · 추첨 글", () => {
  const lottery = (partial: Partial<SessionGame> = {}) =>
    hostCard({
      recruitMethod: RECRUIT_METHOD.lottery,
      endDate: new Date("2026-09-18T19:00:00+09:00"),
      participants: [me(PARTICIPANT_STATUS.waiting)],
      ...partial,
    });

  it("마감 전에는 마감 때 추첨한다고 적고 모집 중 배지다", () => {
    const card = lottery();
    expect(card.badge).toBe("모집 중");
    expect(card.schedule).toBe("9월 18일 19:00 마감 때 추첨합니다");
    expect(card.urgent).toBe(false);
    expect(card.action?.label).toBe("운영 관리");
  });

  it("마감 뒤에도 모집 중 배지이고 붉지 않다", () => {
    const card = lottery({ endDate: at(-1) });
    expect(card.badge).toBe("모집 중");
    expect(card.schedule).toBe("모집이 끝나 곧 추첨합니다");
    expect(card.urgent).toBe(false);
    expect(card.scheduleIcon).toBe(SESSION_ICON.clock);
    expect(card.action?.label).toBe("운영 관리");
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

  it("끝난 세션에는 출석 확인이 할 일로 남고, 카드 버튼은 출석 관리다", () => {
    const card = hostCard({ id: "ended", confirmedAt: at(-1), participants: [confirmedMe, other] });
    expect(card.todo?.kind).toBe(SESSION_ACTION_KIND.confirmAttendance);
    expect(card.todo?.lines).toHaveLength(2);
    expect(card.action?.href).toBe("/games/ended/attendance");
  });

  it("출석 할 일은 자동 처리까지 남은 날을 머리표에 단다", () => {
    const card = hostCard({ confirmedAt: at(-0.5), participants: [confirmedMe, other] });
    expect(card.todo?.eyebrow).toBe("출석 확인 · 자동 처리 D-1");
    expect(card.todo?.lines[1]).toBe("확인하지 않으면 출석이 자동으로 확정됩니다.");
  });

  it("마감 전이라도 대기자가 있는 선착순 구인은 참여자 관리가 할 일이다", () => {
    const waiting = { ...other, userId: "b", status: PARTICIPANT_STATUS.waiting };
    const card = hostCard({ participants: [other, waiting] });
    expect(card.todo?.kind).toBe(SESSION_ACTION_KIND.fillVacancy);
    expect(card.todo?.label).toBe("참여자 관리");
    expect(card.todo?.lines[1]).toBe("대기 중인 1명 가운데 누구를 올릴지 정해 주세요.");
  });

  it("출석을 확정한 뒤에는 후기 보기를 단다", () => {
    const card = hostCard({
      id: "ended",
      confirmedAt: at(-1),
      attendanceConfirmedAt: at(-1),
      participants: [confirmedMe, other],
    });
    expect(card.todo).toBeNull();
    expect(card.action?.href).toBe("/games/ended/reviews");
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

  it("세션이 시작된 뒤에도 대기로 남은 신청은 참여 이력에서 뺀다", () => {
    const waitingMe = me(PARTICIPANT_STATUS.waiting);
    const sessions = buildSessions({
      hosted: [],
      joined: [
        game({ id: "missed", confirmedAt: at(-1), participants: [other, waitingMe] }),
        game({ id: "upcoming", confirmedAt: at(2), participants: [other, waitingMe] }),
      ],
      ...context(),
    });
    expect(sessions[SESSION_ROLE.player].map((item) => item.id)).toEqual(["upcoming"]);
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
    viewerId: "viewer",
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

describe("buildProfileSessions · 숨긴 구인과 내보낸 참여", () => {
  const hiddenGame = game({
    id: "hidden",
    hiddenAt: at(-1),
    confirmedAt: at(-2),
    participants: [confirmedMe, other],
  });
  const removedEnded = game({
    id: "removed-ended",
    confirmedAt: at(-2),
    participants: [other, me(PARTICIPANT_STATUS.removed)],
  });
  const removedOngoing = game({
    id: "removed-ongoing",
    confirmedAt: new Date(NOW.getTime() - 60 * 60 * 1000),
    participants: [other, me(PARTICIPANT_STATUS.removed)],
  });
  const build = (viewerId: string | null) =>
    buildProfileSessions({
      hosted: [],
      joined: [hiddenGame, removedEnded, removedOngoing],
      userId: "me",
      viewerId,
      now: NOW,
    })[SESSION_ROLE.player];
  const hiddenOf = (viewerId: string | null) =>
    build(viewerId).find((card) => card.id === "hidden")?.hidden;

  it("숨긴 구인은 GM·참여자에게는 그대로, 그 밖의 사람·비로그인에게는 가린다", () => {
    expect(hiddenOf("gm")).toBe(false);
    expect(hiddenOf("a")).toBe(false);
    expect(hiddenOf("stranger")).toBe(true);
    expect(hiddenOf(null)).toBe(true);
  });

  it("불참으로 내보낸 참여는 세션이 끝난 뒤에만 참여 탭에 남는다", () => {
    const ids = build("stranger").map((card) => card.id);
    expect(ids).toContain("removed-ended");
    expect(ids).not.toContain("removed-ongoing");
  });
});

describe("남의 세션 기록 카드(readOnly)", () => {
  const readOnlyContext = { ...context(), readOnly: true };
  const readOnlyCard = (partial: Partial<SessionGame>, role: SessionRole = SESSION_ROLE.player) =>
    toSessionCard({ game: game(partial), role, context: readOnlyContext });

  it("불참으로 끝난 세션도 회색 완료와 세션을 마쳤다는 줄이다", () => {
    const card = readOnlyCard({
      confirmedAt: at(-1),
      attendanceConfirmedAt: at(-1),
      participants: [{ ...confirmedMe, absent: true }, other],
    });
    expect(card.badge).toBe("완료");
    expect(card.badgeColor).toBe("gray");
    expect(card.titleDanger).toBe(false);
    expect(card.schedule).toMatch(/ · 세션을 마쳤습니다/);
    expect(card.scheduleTone).not.toBe(SESSION_TONE.danger);
  });

  it("불참으로 내보낸 참여도 완료다", () => {
    const card = readOnlyCard({
      confirmedAt: at(-1),
      attendanceConfirmedAt: at(-1),
      participants: [{ ...me(PARTICIPANT_STATUS.removed), absent: true }, other],
    });
    expect(card.badge).toBe("완료");
    expect(card.titleDanger).toBe(false);
  });

  it("추첨 글 마감 뒤 뽑기 전에는 추첨 진행 문구를 두지 않는다", () => {
    const card = readOnlyCard(
      {
        recruitMethod: RECRUIT_METHOD.lottery,
        endDate: at(-1),
        participants: [me(PARTICIPANT_STATUS.waiting)],
      },
      SESSION_ROLE.host,
    );
    expect(card.schedule).not.toMatch(/추첨/);
  });

  it("프로필 주인이 GM인 끝난 구인과 취소된 구인에도 다시 열기를 두지 않는다", () => {
    const sessions = buildProfileSessions({
      hosted: [
        game({ id: "ended", gmId: "me", confirmedAt: at(-2), endedAt: at(-1), serverId: "s" }),
        game({ id: "cancelled", gmId: "me", cancelledAt: at(-1), serverId: "s" }),
      ],
      joined: [],
      userId: "me",
      viewerId: "stranger",
      now: NOW,
    })[SESSION_ROLE.host];
    expect(sessions).toHaveLength(2);
    expect(sessions.every((card) => !card.canReopen)).toBe(true);
  });

  it("내 세션 목록에서는 끝난 내 구인에 다시 열기가 남는다", () => {
    const card = toSessionCard({
      game: game({ gmId: "me", confirmedAt: at(-2), endedAt: at(-1), serverId: "s" }),
      role: SESSION_ROLE.host,
      context: context(),
    });
    expect(card.canReopen).toBe(true);
  });

  it("숨긴 구인은 가린 카드로 제목·일정·GM을 비운다", () => {
    const [card] = buildProfileSessions({
      hosted: [],
      joined: [game({ id: "hidden", hiddenAt: at(-1), participants: [confirmedMe] })],
      userId: "me",
      viewerId: "stranger",
      now: NOW,
    })[SESSION_ROLE.player];
    expect(card).toMatchObject({ hidden: true, title: "", schedule: "", gm: null });
  });
});
