// Runnable self-check for game domain rules (no test framework). Run: pnpm check
import assert from "node:assert";
import { canCoordinateSchedule } from "./can-coordinate-schedule";
import { isDeadlinePassed, isDeadlineUrgent } from "./deadline";
import { deriveGameStatus } from "./derive-game-status";
import { countConfirmed } from "./participant";
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

// 마감 임박: 지나지 않았고 24시간 이내일 때만
const NOW = new Date("2026-09-11T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() + 5 * HOUR), NOW), true);
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() + 30 * HOUR), NOW), false);
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() - HOUR), NOW), false); // 이미 지남
assert.equal(isDeadlinePassed(new Date(NOW.getTime() - HOUR), NOW), true);
assert.equal(isDeadlinePassed(new Date(NOW.getTime() + HOUR), NOW), false);

console.log("game.check: OK");
