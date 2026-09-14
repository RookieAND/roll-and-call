import assert from "node:assert/strict";
import { fromKstDateTimeInput, toKstDateInput, toKstDateTimeInput } from "./date-input";
import { formatDateTime } from "./format";

// 수요일 20:00(KST)을 고르면 UTC 11:00으로 저장되고, 다시 KST 20:00으로 보여야 한다.
// TZ=UTC(Vercel)에서도 같은 결과여야 하므로 실행 환경 타임존에 기대지 않는다.
const saved = fromKstDateTimeInput("2026-09-16T20:00");
assert.equal(saved.toISOString(), "2026-09-16T11:00:00.000Z");
assert.equal(toKstDateTimeInput(saved), "2026-09-16T20:00");
assert.equal(formatDateTime(saved), "9월 16일 (수) 20:00");

// 자정을 넘는 경계: UTC 15:30은 KST 다음 날 00:30
assert.equal(toKstDateTimeInput("2026-09-16T15:30:00Z"), "2026-09-17T00:30");
assert.equal(toKstDateInput("2026-09-16T15:30:00Z"), "2026-09-17");

console.log("date-input.check ok");
