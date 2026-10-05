import { describe, expect, it } from "vitest";

import { buildLadderDetail } from "./build-ladder-detail";
import { buildMonthlyDetail } from "./build-monthly-detail";

const now = new Date("2026-10-20T03:00:00Z");

describe("buildMonthlyDetail", () => {
  it("다는 중이면 말일까지 붙는다는 줄, 받은 달 목록 끝에 M월 D일까지", () => {
    const detail = buildMonthlyDetail({
      ladder: "gm.monthly",
      months: ["2026-09", "2026-06"],
      countOf: (month) => (month === "2026-09" ? 5 : 3),
      now,
    });
    expect(detail.tierLabel).toBe("골드");
    expect(detail.condition).toBe(
      "한 달 동안 세션을 가장 많이 연 GM입니다.\n10월 31일까지 프로필에 붙습니다.",
    );
    expect(detail.earned?.source).toMatchObject({ heading: "9월 기록", label: "5회 진행 · 1위" });
    expect(detail.steps.map((step) => [step.name, step.caption, step.status])).toEqual([
      ["2026년 9월", "5회 진행 · 1위", "10월 31일까지"],
      ["2026년 6월", "3회 진행 · 1위", ""],
    ]);
  });

  it("남의 기록은 횟수 없이 1위만, 다는 중이 아니면 붙는다는 줄이 없다", () => {
    const detail = buildMonthlyDetail({
      ladder: "pl.monthly",
      months: ["2026-08"],
      countOf: null,
      now,
    });
    expect(detail.tierLabel).toBe("골드");
    expect(detail.condition).not.toContain("까지");
    expect(detail.steps[0]).toMatchObject({ caption: "1위", status: "" });
  });
});

describe("buildLadderDetail", () => {
  it("근거 세션 줄은 채운 세션이다", () => {
    const detail = buildLadderDetail({
      ladder: "pl.total",
      categoryName: null,
      stepIndex: 0,
      held: {
        tier: 1,
        earnedAt: now,
        source: { gameId: "g", title: "물벼락", startsAt: new Date("2026-09-19T10:00:00Z") },
      },
      events: null,
    });
    expect(detail.earned?.source).toMatchObject({
      heading: "채운 세션",
      label: "물벼락 · 9월 19일",
    });
  });
});
