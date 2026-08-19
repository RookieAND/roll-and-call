// Runnable self-check for session derivation (no test framework).
// Run: pnpm -F web exec tsx src/entities/game/model/session.check.ts
import assert from "node:assert";
import {
  bucketHosted,
  bucketJoined,
  dday,
  deriveSessionState,
  type SessionGame,
  toSessionCard,
} from "./session";

const NOW = new Date("2026-08-20T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

function game(partial: Partial<SessionGame>): SessionGame {
  return {
    id: "g",
    gmId: "gm",
    title: "제목",
    rule: "CoC",
    synopsis: null,
    thumbnailUrl: null,
    playTime: null,
    maxPlayers: 4,
    scheduleMode: "coordinate",
    endDate: new Date(NOW.getTime() + 10 * DAY),
    rangeStart: null,
    rangeEnd: null,
    confirmedAt: null,
    notifiedAt: null,
    parentGameId: null,
    round: 1,
    createdAt: NOW,
    gm: { username: "도윤" },
    participants: [],
    ...partial,
  };
}

function confirmed(count: number, extra: SessionGame["participants"] = []) {
  return [
    ...Array.from({ length: count }, (_, i) => ({
      userId: `c${i}`,
      status: "confirmed" as const,
      joinedAt: new Date(NOW.getTime() - (count - i) * HOUR),
    })),
    ...extra,
  ];
}

// --- deriveSessionState: 6 states ---
const base = { maxPlayers: 4, scheduleMode: "coordinate" as const };
assert.equal(
  deriveSessionState(
    { ...base, confirmedAt: new Date(NOW.getTime() + DAY), endDate: NOW, confirmedCount: 4 },
    NOW,
  ),
  "confirmed",
);
assert.equal(
  deriveSessionState(
    { ...base, confirmedAt: new Date(NOW.getTime() - DAY), endDate: NOW, confirmedCount: 4 },
    NOW,
  ),
  "finished",
);
assert.equal(
  deriveSessionState(
    { ...base, confirmedAt: null, endDate: new Date(NOW.getTime() - DAY), confirmedCount: 2 },
    NOW,
  ),
  "closed",
);
assert.equal(
  deriveSessionState(
    { ...base, confirmedAt: null, endDate: new Date(NOW.getTime() + DAY), confirmedCount: 2 },
    NOW,
  ),
  "recruiting",
);
assert.equal(
  deriveSessionState(
    { ...base, confirmedAt: null, endDate: new Date(NOW.getTime() + DAY), confirmedCount: 4 },
    NOW,
  ),
  "scheduling",
);
assert.equal(
  deriveSessionState(
    {
      ...base,
      scheduleMode: "fixed",
      confirmedAt: null,
      endDate: new Date(NOW.getTime() + DAY),
      confirmedCount: 4,
    },
    NOW,
  ),
  "pending_confirm",
);

// --- dday: calendar-day difference ---
assert.equal(dday(new Date("2026-08-23T01:00:00+09:00"), NOW), 3);
assert.equal(dday(new Date("2026-08-20T23:00:00+09:00"), NOW), 0);

// --- toSessionCard: host sublines + badges ---
const hostRecruiting = toSessionCard({
  game: game({ participants: confirmed(1) }),
  role: "host",
  viewerId: "gm",
  now: NOW,
});
assert.equal(hostRecruiting.lead, "모집 중");
assert.equal(hostRecruiting.rest, "1 / 4명");
assert.equal(hostRecruiting.badge.kind, "deadline");

const hostPending = toSessionCard({
  game: game({ scheduleMode: "fixed", participants: confirmed(4) }),
  role: "host",
  viewerId: "gm",
  now: NOW,
});
assert.equal(hostPending.lead, "확정 대기");
assert.equal(hostPending.rest, "신청 4명 · 정원 4명");

// urgent: 마감 24h 이내 → 빨강 + 카드 강조
const urgent = toSessionCard({
  game: game({ endDate: new Date(NOW.getTime() + 5 * HOUR), participants: confirmed(1) }),
  role: "host",
  viewerId: "gm",
  now: NOW,
});
assert.equal(urgent.urgent, true);
assert.equal(urgent.badge.kind === "deadline" && urgent.badge.urgent, true);

// --- player: confirmed shows session badge + KP; waitlisted shows 대기 N번 ---
const playerConfirmed = toSessionCard({
  game: game({ confirmedAt: new Date(NOW.getTime() + 3 * DAY), participants: confirmed(4) }),
  role: "player",
  viewerId: "c0",
  now: NOW,
});
assert.equal(playerConfirmed.badge.kind, "session");
assert.ok(playerConfirmed.rest.includes("KP 도윤"));

const playerWaiting = toSessionCard({
  game: game({
    participants: [
      ...confirmed(4),
      { userId: "me", status: "waiting", joinedAt: new Date(NOW.getTime()) },
    ],
  }),
  role: "player",
  viewerId: "me",
  now: NOW,
});
assert.equal(playerWaiting.badge.kind, "waiting");
assert.equal(playerWaiting.badge.kind === "waiting" && playerWaiting.badge.label, "대기 1번");
assert.ok(playerWaiting.rest.startsWith("일정 미정"));

// --- bucketing: tabs + sort ---
const hostBuckets = bucketHosted(
  [
    game({ id: "r", participants: confirmed(1) }),
    game({ id: "cf", confirmedAt: new Date(NOW.getTime() + DAY), participants: confirmed(4) }),
    game({ id: "cl", endDate: new Date(NOW.getTime() - DAY), participants: confirmed(1) }),
  ],
  "gm",
  NOW,
);
assert.deepEqual(
  hostBuckets.recruiting.map((c) => c.id),
  ["r"],
);
assert.deepEqual(
  hostBuckets.confirmed.map((c) => c.id),
  ["cf"],
);
assert.deepEqual(
  hostBuckets.closed.map((c) => c.id),
  ["cl"],
);

// closed 탭은 최근 지난 것부터(desc)
const joinedBuckets = bucketJoined(
  [
    game({ id: "old", confirmedAt: new Date(NOW.getTime() - 5 * DAY), participants: confirmed(4) }),
    game({
      id: "recent",
      confirmedAt: new Date(NOW.getTime() - 1 * DAY),
      participants: confirmed(4),
    }),
  ],
  "c0",
  NOW,
);
assert.deepEqual(
  joinedBuckets.closed.map((c) => c.id),
  ["recent", "old"],
);

console.log("session.check: OK");
