import assert from "node:assert/strict";
import { isSessionLocked } from "./session-lock";

const now = Date.parse("2026-09-14T00:00:00Z");
const future = new Date("2026-09-20T11:00:00Z");
const past = new Date("2026-09-10T11:00:00Z");

// 조율형: 확정 전엔 열림, 확정되면 잠김
assert.equal(isSessionLocked({ scheduleMode: "coordinate", confirmedAt: null, now }), false);
assert.equal(isSessionLocked({ scheduleMode: "coordinate", confirmedAt: future, now }), true);
// 일시 지정형: 세션 시각이 있어도 시작 전엔 열림(참여하기), 지나면 잠김
assert.equal(isSessionLocked({ scheduleMode: "fixed", confirmedAt: future, now }), false);
assert.equal(isSessionLocked({ scheduleMode: "fixed", confirmedAt: past, now }), true);

console.log("session-lock.check ok");
