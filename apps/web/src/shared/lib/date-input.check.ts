import assert from "node:assert/strict";

import { addDays } from "./add-days";
import { buildDayColumns } from "./build-day-columns";
import { ddayKst } from "./dday-kst";
import { formatDate } from "./format-date";
import { formatDateTime } from "./format-date-time";
import { fromKstDateTimeInput } from "./from-kst-date-time-input";
import { slotIso } from "./slot-iso";
import { toKstDateInput } from "./to-kst-date-input";
import { toKstDateTimeInput } from "./to-kst-date-time-input";

// TZ=UTC(Vercel)에서도 같은 결과여야 하므로 실행 환경 타임존에 기대지 않는다.
const saved = fromKstDateTimeInput("2026-09-16T20:00");
assert.equal(saved.toISOString(), "2026-09-16T11:00:00.000Z");
assert.equal(toKstDateTimeInput(saved), "2026-09-16T20:00");
assert.equal(formatDateTime(saved), "9월 16일 (수) 20:00");

assert.equal(toKstDateTimeInput("2026-09-16T15:30:00Z"), "2026-09-17T00:30");
assert.equal(toKstDateInput("2026-09-16T15:30:00Z"), "2026-09-17");
assert.equal(formatDate("2026-09-16T15:30:00Z"), "9월 17일");

assert.equal(slotIso("2026-09-16", 23, 30), "2026-09-16T14:30:00.000Z");
assert.equal(addDays("2026-03-01", -1), "2026-02-28");
assert.equal(addDays("2026-12-31", 1), "2027-01-01");
assert.equal(ddayKst("2026-09-16T15:30:00Z", new Date("2026-09-16T14:30:00Z")), 1);

const columns = buildDayColumns("2026-12-31", "2027-01-01");
assert.deepEqual(
  columns.map((column) => column.label),
  ["12/31(목)", "1/1(금)"],
);
assert.equal(buildDayColumns("2026-01-01", "2026-12-31").length, 61);

console.log("date-input.check ok");
