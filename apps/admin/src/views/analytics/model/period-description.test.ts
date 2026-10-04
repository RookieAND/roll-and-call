import { describe, expect, it } from "vitest";

import { periodDescription } from "./period-description";

const period = {
  from: new Date("2026-09-07T03:00:00Z"),
  to: new Date("2026-10-05T03:00:00Z"),
  serviceWeeks: 3,
};

describe("periodDescription", () => {
  it("평소에 비교할 수 있으면 지난 4주와 비교한다", () => {
    expect(periodDescription({ early: false, compare: true, period })).toBe(
      "2026년 9월 7일~10월 5일 · 지난 4주와 비교",
    );
  });

  it("평소인데 지난 기간이 없으면 그렇게 적는다", () => {
    expect(periodDescription({ early: false, compare: false, period })).toBe(
      "2026년 9월 7일~10월 5일 · 비교할 지난 기간이 없습니다",
    );
  });

  it("초기에는 서비스 시작 후 주 수를 함께 적는다", () => {
    expect(periodDescription({ early: true, compare: false, period })).toBe(
      "2026년 9월 7일~10월 5일 · 서비스 시작 후 3주 · 비교할 지난 기간이 없습니다",
    );
  });
});
