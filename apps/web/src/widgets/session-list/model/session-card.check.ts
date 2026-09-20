import assert from "node:assert";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  RECRUIT_METHOD,
  SCHEDULE_MODE,
  SESSION_ROLE,
} from "@/entities/game";

import { buildProfileSessions } from "./build-profile-sessions";
import { buildSessions } from "./build-sessions";
import { SESSION_CHIP, type SessionGame } from "./session-card-model";
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
    gm: { username: "한랑아" },
    participants: [],
    ...partial,
  } as unknown as SessionGame;
}

const me = (status: ParticipantStatus) => ({ userId: "me", status, joinedAt: at(-1) });
const other = { userId: "a", status: PARTICIPANT_STATUS.confirmed, joinedAt: at(-10) };
const sessionContext = (responded: string[] = []) => ({
  viewerId: "me",
  respondedGameIds: new Set(responded),
  responseCounts: new Map<string, number>(),
  now: NOW,
});

const confirmedMe = me(PARTICIPANT_STATUS.confirmed);

let card = toSessionCard(
  game({ participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.scheduling);
assert.equal(card.todo?.label, "일정 조율");
assert.match(card.schedule, /^가능 시간 미제출 · 마감 D-3$/);

card = toSessionCard(
  game({ participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(["g"]),
);
assert.equal(card.todo, null);

card = toSessionCard(
  game({ confirmedAt: at(2), endDate: at(-1), participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.confirmed);
assert.match(card.schedule, /모레$/);

// 대기: 배지로만 갈리고 버튼은 "대기 취소" 하나다.
card = toSessionCard(
  game({ participants: [other, me(PARTICIPANT_STATUS.waiting)] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.waiting);
assert.equal(card.badge, "승인 대기");
assert.equal(card.action?.label, "대기 취소");
assert.match(card.schedule, /^신청 2일째 · GM이 아직 보지 않았습니다$/);

// 추첨은 뽑기 전까지 순번이 없다 — "신청"으로 세고 버튼도 신청 취소다.
card = toSessionCard(
  game({
    recruitMethod: RECRUIT_METHOD.lottery,
    participants: [other, me(PARTICIPANT_STATUS.waiting)],
  }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.badge, "추첨 전");
assert.match(card.meta, /신청 2 · 정원 4$/);
assert.equal(card.action?.label, "신청 취소");

// 조율형 · 기한 지남 · 확정자 있음 · 미확정 → 무산이 아니라 GM 할 일
card = toSessionCard(
  game({ endDate: at(-1), participants: [other] }),
  SESSION_ROLE.host,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.recruiting);
assert.equal(card.todo?.label, "세션 시간 확정하기");
assert.equal(card.action?.label, "운영 관리");

// 종료 카드는 완료 · 무산 · 대기 종료로 갈린다.
card = toSessionCard(
  game({ confirmedAt: at(-1), participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.ended);
assert.equal(card.badge, "완료");

card = toSessionCard(
  game({ endDate: at(-1), participants: [] }),
  SESSION_ROLE.host,
  sessionContext(),
);
assert.equal(card.badge, "무산");

card = toSessionCard(
  game({ confirmedAt: at(-1), participants: [other, me(PARTICIPANT_STATUS.waiting)] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.badge, "대기 종료");

// 역할로만 가르고, 진행 중이 먼저 · 종료은 최근 것부터 뒤에 온다.
const sessions = buildSessions({
  hosted: [game({ id: "hosted-done", confirmedAt: at(-2), participants: [other] })],
  joined: [
    game({ id: "old", confirmedAt: at(-5), participants: [confirmedMe] }),
    game({ id: "recent", confirmedAt: at(-1), participants: [confirmedMe] }),
    game({ id: "later", endDate: at(6), participants: [confirmedMe] }),
    game({ id: "sooner", endDate: at(2), participants: [confirmedMe] }),
  ],
  ...sessionContext(),
});
assert.deepEqual(
  sessions[SESSION_ROLE.player].map((item) => item.id),
  ["sooner", "later", "recent", "old"],
);
assert.deepEqual(
  sessions[SESSION_ROLE.host].map((item) => item.id),
  ["hosted-done"],
);

// 남의 프로필: 대기 신청은 빼고, 할 일 버튼과 미제출 문구 없이 기록만
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
assert.deepEqual(
  profile[SESSION_ROLE.player].map((item) => item.id),
  ["upcoming", "played"],
);
const upcomingCard = profile[SESSION_ROLE.player][0];
assert.ok(upcomingCard);
assert.equal(upcomingCard.action, null);
assert.equal(upcomingCard.urgent, false);
assert.doesNotMatch(upcomingCard.schedule, /미제출/);
assert.equal(profile[SESSION_ROLE.host].length, 1);
assert.equal(profile[SESSION_ROLE.host][0]?.action, null);

console.log("session-card.check ok");
