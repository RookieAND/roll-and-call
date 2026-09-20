import { describe, expect, it } from "vitest";

import { buildDayColumns } from "@/shared/lib";

import { groupDaysByWeek } from "./group-days-by-week";
import { weekIndexOf } from "./week-index-of";

// 2026-09-10(목) ~ 09-22(화): 목~일 / 월~일 / 월~화
const weeks = groupDaysByWeek(buildDayColumns("2026-09-10", "2026-09-22"));

describe("groupDaysByWeek", () => {
  it("월요일에서 주를 끊는다", () => {
    expect(weeks.map((week) => week.length)).toEqual([4, 7, 2]);
    expect(weeks[1]![0]!.dow).toBe("월");
    expect(weeks[1]!.at(-1)!.dow).toBe("일");
  });

  it("빈 기간은 빈 주 목록이다", () => {
    expect(groupDaysByWeek([])).toEqual([]);
  });
});

describe("weekIndexOf", () => {
  it("그 날짜가 든 주를 찾는다", () => {
    expect(weekIndexOf(weeks, "2026-09-19")).toBe(1);
  });

  it("없는 날짜와 빈 값은 첫 주로 둔다", () => {
    expect(weekIndexOf(weeks, null)).toBe(0);
    expect(weekIndexOf(weeks, "2030-01-01")).toBe(0);
  });
});
