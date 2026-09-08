// Runnable self-check for game domain rules (no test framework). Run: pnpm check
import assert from "node:assert";
import { canCoordinateSchedule } from "./can-coordinate-schedule";
import { deriveGameStatus } from "./derive-game-status";
import { countConfirmed } from "./participant";
import { rankSlots } from "./rank-slots";
import { splitRoster } from "./split-roster";

const DAY = 86_400_000;
const future = new Date(Date.now() + DAY);
const past = new Date(Date.now() - DAY);

// 기한 경과가 정원보다 우선
assert.equal(deriveGameStatus({ maxPlayers: 4, endDate: past, participantCount: 4 }), "closed");
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: future, participantCount: 4 }),
  "confirmed",
);
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: future, participantCount: 1 }),
  "recruiting",
);

// 정원은 확정자만 센다
const roster = [
  { userId: "b", status: "confirmed" as const, joinedAt: new Date(2) },
  { userId: "a", status: "confirmed" as const, joinedAt: new Date(1) },
  { userId: "c", status: "waiting" as const, joinedAt: new Date(3) },
  { userId: "d", status: "waiting" as const, joinedAt: new Date(4) },
];
assert.equal(countConfirmed(roster), 2);

// 신청 순(joinedAt)으로 전체 순번, 대기자는 대기 순번까지
const { confirmed, waiting } = splitRoster(roster);
assert.deepEqual(
  confirmed.map((p) => [p.userId, p.applicationRank]),
  [
    ["a", 1],
    ["b", 2],
  ],
);
assert.deepEqual(
  waiting.map((p) => [p.userId, p.applicationRank, p.waitlistRank]),
  [
    ["c", 3, 1],
    ["d", 4, 2],
  ],
);

// 조율 진입: coordinate + 미확정 + 미마감
assert.equal(
  canCoordinateSchedule({ scheduleMode: "coordinate", confirmedAt: null, status: "recruiting" }),
  true,
);
assert.equal(
  canCoordinateSchedule({ scheduleMode: "coordinate", confirmedAt: future, status: "recruiting" }),
  false,
);
assert.equal(
  canCoordinateSchedule({ scheduleMode: "fixed", confirmedAt: null, status: "recruiting" }),
  false,
);

// 후보 슬롯: 인원 내림차순, 동률이면 이른 시각
assert.deepEqual(
  rankSlots({
    counts: { "2026-09-10T11:00:00.000Z": 2, "2026-09-09T11:00:00.000Z": 2, x: 3 },
    limit: 2,
  }),
  [
    { iso: "x", count: 3 },
    { iso: "2026-09-09T11:00:00.000Z", count: 2 },
  ],
);

console.log("game.check: OK");
