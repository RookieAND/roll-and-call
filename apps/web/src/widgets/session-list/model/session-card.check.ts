import assert from "node:assert";

import {
  PARTICIPANT_STATUS,
  type ParticipantStatus,
  SCHEDULE_MODE,
  SESSION_ROLE,
} from "@/entities/game";

import { buildSessions } from "./build-sessions";
import { SESSION_BUCKET, SESSION_CHIP, type SessionGame } from "./session-card-model";
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
    round: 1,
    maxPlayers: 4,
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    endDate: at(3),
    rangeStart: "2026-09-20",
    rangeEnd: "2026-09-24",
    waitlistEnabled: true,
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
assert.equal(card.bucket, SESSION_BUCKET.joined);
assert.equal(card.chip, SESSION_CHIP.scheduling);
assert.equal(card.action?.label, "일정 조율");
assert.match(card.schedule, /^가능 시간 미제출 · 마감 D-3$/);

card = toSessionCard(
  game({ participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(["g"]),
);
assert.equal(card.action, null);

card = toSessionCard(
  game({ confirmedAt: at(2), endDate: at(-1), participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.confirmed);
assert.match(card.schedule, /모레$/);

card = toSessionCard(
  game({ participants: [other, me(PARTICIPANT_STATUS.waiting)] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.chip, SESSION_CHIP.waiting);
assert.equal(card.badge, "대기 1번");

// 조율형 · 기한 지남 · 확정자 있음 · 미확정 → 무산이 아니라 GM 할 일
card = toSessionCard(
  game({ endDate: at(-1), participants: [other] }),
  SESSION_ROLE.host,
  sessionContext(),
);
assert.equal(card.bucket, SESSION_BUCKET.hosted);
assert.equal(card.action?.label, "세션 시간 확정하기");

card = toSessionCard(
  game({ confirmedAt: at(-1), participants: [confirmedMe] }),
  SESSION_ROLE.player,
  sessionContext(),
);
assert.equal(card.bucket, SESSION_BUCKET.past);

// 끝남은 최근 것부터, 진행 중은 가까운 것부터
const sessions = buildSessions({
  hosted: [],
  joined: [
    game({ id: "old", confirmedAt: at(-5), participants: [confirmedMe] }),
    game({ id: "recent", confirmedAt: at(-1), participants: [confirmedMe] }),
    game({ id: "later", endDate: at(6), participants: [confirmedMe] }),
    game({ id: "sooner", endDate: at(2), participants: [confirmedMe] }),
  ],
  ...sessionContext(),
});
assert.deepEqual(
  sessions.past.map((pastCard) => pastCard.id),
  ["recent", "old"],
);
assert.deepEqual(
  sessions.joined.map((joinedCard) => joinedCard.id),
  ["sooner", "later"],
);

console.log("session-card.check ok");
