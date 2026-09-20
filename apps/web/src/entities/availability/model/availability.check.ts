import assert from "node:assert";

import { aggregateAvailability } from "./aggregate-availability";
import { rankWindows } from "./rank-windows";

const EARLY = new Date("2026-09-09T11:00:00.000Z");
const LATE = new Date("2026-09-10T11:00:00.000Z");

const { counts, names, mine } = aggregateAvailability({
  avails: [
    { slotStart: EARLY, userId: "me", user: { username: "도윤" } },
    { slotStart: EARLY, userId: "u2", user: { username: "서진" } },
    { slotStart: LATE, userId: "u2", user: null },
  ],
  userId: "me",
});
assert.equal(counts[EARLY.toISOString()], 2);
assert.equal(counts[LATE.toISOString()], 1);
assert.deepEqual(names[EARLY.toISOString()], ["도윤", "서진"]);
assert.deepEqual(names[LATE.toISOString()], ["?"]);
assert.deepEqual(mine, [EARLY.toISOString()]);

assert.deepEqual(
  aggregateAvailability({
    avails: [{ slotStart: EARLY, userId: "u2", user: null }],
    userId: null,
  }).mine,
  [],
);

// 후보는 시작 칸부터 연속으로 두 칸을 모두 낸 사람만 센다.
const WINDOW_NAMES = {
  "2026-09-09T11:00:00.000Z": ["도윤", "서진"],
  "2026-09-09T11:30:00.000Z": ["도윤", "서진"],
  "2026-09-09T12:00:00.000Z": ["도윤"],
  "2026-09-10T11:00:00.000Z": ["서진"],
  "2026-09-10T11:30:00.000Z": ["서진"],
};

assert.deepEqual(rankWindows({ names: WINDOW_NAMES, slotCount: 2, limit: 3 }), [
  { iso: "2026-09-09T11:00:00.000Z", members: ["도윤", "서진"] },
  { iso: "2026-09-09T11:30:00.000Z", members: ["도윤"] },
  { iso: "2026-09-10T11:00:00.000Z", members: ["서진"] },
]);

// 끊기면 후보가 아니다: 12:00에서 시작하면 12:30 칸이 없다.
assert.deepEqual(
  rankWindows({ names: WINDOW_NAMES, slotCount: 2, limit: 3 })
    .map((window) => window.iso)
    .includes("2026-09-09T12:00:00.000Z"),
  false,
);

console.log("availability.check: OK");
