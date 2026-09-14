// Runnable self-check for session card classification (no test framework).
// Run: pnpm check
import assert from "node:assert";
import { buildSessions, type SessionGame, toSessionCard } from "./session-card";

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
    scheduleMode: "coordinate",
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

const me = (status: "confirmed" | "waiting") => ({ userId: "me", status, joinedAt: at(-1) });
const other = { userId: "a", status: "confirmed" as const, joinedAt: at(-10) };
const ctx = (responded: string[] = []) => ({
  viewerId: "me",
  respondedGameIds: new Set(responded),
  responseCounts: new Map<string, number>(),
  now: NOW,
});

// 조율 중 · 가능 시간 미제출 → "일정 조율" 할 일
let card = toSessionCard(game({ participants: [me("confirmed")] }), "player", ctx());
assert.equal(card.bucket, "joined");
assert.equal(card.chip, "scheduling");
assert.equal(card.action?.label, "일정 조율");
assert.match(card.schedule, /^가능 시간 미제출 · 마감 D-3$/);

// 이미 냈으면 할 일 없음
card = toSessionCard(game({ participants: [me("confirmed")] }), "player", ctx(["g"]));
assert.equal(card.action, null);

// 확정된 세션: 확정 칩 + "모레"
card = toSessionCard(
  game({ confirmedAt: at(2), endDate: at(-1), participants: [me("confirmed")] }),
  "player",
  ctx(),
);
assert.equal(card.chip, "confirmed");
assert.match(card.schedule, /모레$/);

// 대기자: 대기 칩 + 순번 배지
card = toSessionCard(game({ participants: [other, me("waiting")] }), "player", ctx());
assert.equal(card.chip, "waiting");
assert.equal(card.badge, "대기 1번");

// GM · 기한 지남 · 미확정 → "세션 시간 확정하기" 할 일
card = toSessionCard(game({ endDate: at(-1), participants: [other] }), "host", ctx());
assert.equal(card.bucket, "hosted");
assert.equal(card.action?.label, "세션 시간 확정하기");

// 세션이 지나면 끝남 탭
card = toSessionCard(game({ confirmedAt: at(-1), participants: [me("confirmed")] }), "player", ctx());
assert.equal(card.bucket, "past");

// 끝남은 최근 것부터, 진행 중은 가까운 것부터
const sessions = buildSessions({
  hosted: [],
  joined: [
    game({ id: "old", confirmedAt: at(-5), participants: [me("confirmed")] }),
    game({ id: "recent", confirmedAt: at(-1), participants: [me("confirmed")] }),
    game({ id: "later", endDate: at(6), participants: [me("confirmed")] }),
    game({ id: "sooner", endDate: at(2), participants: [me("confirmed")] }),
  ],
  ...ctx(),
});
assert.deepEqual(
  sessions.past.map((c) => c.id),
  ["recent", "old"],
);
assert.deepEqual(
  sessions.joined.map((c) => c.id),
  ["sooner", "later"],
);

console.log("session-card.check ok");
