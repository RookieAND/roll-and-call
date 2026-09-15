import assert from "node:assert/strict";

import { formatDateTime } from "./format-date-time";
import { fromKstDateTimeInput } from "./from-kst-date-time-input";
import { toKstDateInput } from "./to-kst-date-input";
import { toKstDateTimeInput } from "./to-kst-date-time-input";

// TZ=UTC(Vercel)에서도 같은 결과여야 하므로 실행 환경 타임존에 기대지 않는다.
const saved = fromKstDateTimeInput("2026-09-16T20:00");
assert.equal(saved.toISOString(), "2026-09-16T11:00:00.000Z");
assert.equal(toKstDateTimeInput(saved), "2026-09-16T20:00");
assert.equal(formatDateTime(saved), "9월 16일 (수) 20:00");

assert.equal(toKstDateTimeInput("2026-09-16T15:30:00Z"), "2026-09-17T00:30");
assert.equal(toKstDateInput("2026-09-16T15:30:00Z"), "2026-09-17");

console.log("date-input.check ok");
