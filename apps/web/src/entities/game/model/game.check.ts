import assert from "node:assert";

import { canCoordinateSchedule } from "./can-coordinate-schedule";
import { deriveGameStatus } from "./derive-game-status";
import { isDeadlinePassed } from "./is-deadline-passed";
import { isDeadlineUrgent } from "./is-deadline-urgent";
import { countConfirmed, PARTICIPANT_STATUS } from "./participant";
import { SCHEDULE_MODE } from "./schedule-mode";
import { splitRoster } from "./split-roster";
import { GAME_STATUS } from "./status";

const DAY = 86_400_000;
const future = new Date(Date.now() + DAY);
const past = new Date(Date.now() - DAY);

// 기한 경과가 정원보다 우선
const waitlistOn = { waitlistEnabled: true };
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: past, participantCount: 4, ...waitlistOn }),
  GAME_STATUS.closed,
);
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: future, participantCount: 4, ...waitlistOn }),
  GAME_STATUS.confirmed,
);
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: future, participantCount: 1, ...waitlistOn }),
  GAME_STATUS.recruiting,
);
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: future, participantCount: 4, waitlistEnabled: false }),
  GAME_STATUS.full,
);
assert.equal(
  deriveGameStatus({ maxPlayers: 4, endDate: past, participantCount: 4, waitlistEnabled: false }),
  GAME_STATUS.closed,
);

const roster = [
  { userId: "b", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(2) },
  { userId: "a", status: PARTICIPANT_STATUS.confirmed, joinedAt: new Date(1) },
  { userId: "c", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(3) },
  { userId: "d", status: PARTICIPANT_STATUS.waiting, joinedAt: new Date(4) },
];
assert.equal(countConfirmed(roster), 2);

const { confirmed, waiting } = splitRoster(roster);
assert.deepEqual(
  confirmed.map((member) => [member.userId, member.applicationRank]),
  [
    ["a", 1],
    ["b", 2],
  ],
);
assert.deepEqual(
  waiting.map((member) => [member.userId, member.applicationRank, member.waitlistRank]),
  [
    ["c", 3, 1],
    ["d", 4, 2],
  ],
);

assert.equal(
  canCoordinateSchedule({
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: null,
    status: GAME_STATUS.recruiting,
  }),
  true,
);
assert.equal(
  canCoordinateSchedule({
    scheduleMode: SCHEDULE_MODE.coordinate,
    confirmedAt: future,
    status: GAME_STATUS.recruiting,
  }),
  false,
);
assert.equal(
  canCoordinateSchedule({
    scheduleMode: SCHEDULE_MODE.fixed,
    confirmedAt: null,
    status: GAME_STATUS.recruiting,
  }),
  false,
);

const NOW = new Date("2026-09-11T12:00:00+09:00");
const HOUR = 60 * 60 * 1000;
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() + 5 * HOUR), NOW), true);
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() + 30 * HOUR), NOW), false);
assert.equal(isDeadlineUrgent(new Date(NOW.getTime() - HOUR), NOW), false);
assert.equal(isDeadlinePassed(new Date(NOW.getTime() - HOUR), NOW), true);
assert.equal(isDeadlinePassed(new Date(NOW.getTime() + HOUR), NOW), false);

console.log("game.check: OK");
