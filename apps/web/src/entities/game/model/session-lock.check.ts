import assert from "node:assert/strict";

import { SCHEDULE_MODE } from "./schedule-mode";
import { isSessionLocked } from "./session-lock";

const now = Date.parse("2026-09-14T00:00:00Z");
const future = new Date("2026-09-20T11:00:00Z");
const past = new Date("2026-09-10T11:00:00Z");

assert.equal(
  isSessionLocked({ scheduleMode: SCHEDULE_MODE.coordinate, confirmedAt: null, now }),
  false,
);
assert.equal(
  isSessionLocked({ scheduleMode: SCHEDULE_MODE.coordinate, confirmedAt: future, now }),
  true,
);
// 일시 지정형은 세션 시각이 있어도 시작 전엔 열려 있다
assert.equal(
  isSessionLocked({ scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: future, now }),
  false,
);
assert.equal(isSessionLocked({ scheduleMode: SCHEDULE_MODE.fixed, confirmedAt: past, now }), true);

console.log("session-lock.check ok");
