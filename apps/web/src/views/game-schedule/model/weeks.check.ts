import assert from "node:assert/strict";

import { buildDayColumns } from "@/shared/lib";

import { groupDaysByWeek } from "./group-days-by-week";
import { weekIndexOf } from "./week-index-of";

// 2026-09-10(목) ~ 09-22(화): 목~일 / 월~일 / 월~화
const weeks = groupDaysByWeek(buildDayColumns("2026-09-10", "2026-09-22"));
assert.deepEqual(
  weeks.map((week) => week.length),
  [4, 7, 2],
);
assert.equal(weeks[1]![0]!.dow, "월");
assert.equal(weeks[1]!.at(-1)!.dow, "일");

assert.equal(weekIndexOf(weeks, "2026-09-19"), 1);
assert.equal(weekIndexOf(weeks, null), 0);
assert.equal(weekIndexOf(weeks, "2030-01-01"), 0);
assert.deepEqual(groupDaysByWeek([]), []);

console.log("weeks.check ok");
