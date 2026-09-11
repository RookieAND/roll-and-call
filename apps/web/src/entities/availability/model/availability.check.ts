// Runnable self-check for availability aggregation (no test framework). Run: pnpm check
import assert from "node:assert";
import { aggregateAvailability } from "./aggregate-availability";
import { rankSlots } from "./rank-slots";

const EARLY = new Date("2026-09-09T11:00:00.000Z");
const LATE = new Date("2026-09-10T11:00:00.000Z");

// 슬롯별 인원·이름 집계 + 본인이 고른 슬롯 분리
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
assert.deepEqual(names[LATE.toISOString()], ["?"]); // 이름 없으면 "?"
assert.deepEqual(mine, [EARLY.toISOString()]);

// 비로그인(userId=null)이면 mine은 비어 있다
assert.deepEqual(
  aggregateAvailability({
    avails: [{ slotStart: EARLY, userId: "u2", user: null }],
    userId: null,
  }).mine,
  [],
);

// 후보 슬롯: 인원 내림차순, 동률이면 이른 시각
assert.deepEqual(
  rankSlots({
    counts: { [LATE.toISOString()]: 2, [EARLY.toISOString()]: 2, x: 3 },
    limit: 2,
  }),
  [
    { iso: "x", count: 3 },
    { iso: EARLY.toISOString(), count: 2 },
  ],
);

console.log("availability.check: OK");
