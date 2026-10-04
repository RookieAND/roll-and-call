import { describe, expect, it } from "vitest";

import { SCHEDULE_MODE } from "@/entities/game";

import { MY_DRAW_ACTION, myDrawFooter } from "./my-draw-footer";

const startsAt = new Date("2026-09-16T11:00:00Z");

describe("myDrawFooter", () => {
  it("확정 · 조율형 · 세션 시각 없음이면 가능 시간 제출을 함께 둔다", () => {
    expect(
      myDrawFooter({
        confirmed: true,
        scheduleMode: SCHEDULE_MODE.coordinate,
        confirmedAt: null,
        sessionEnded: false,
      }),
    ).toEqual({
      hint: "시간이 정해지면 알림 탭으로 알립니다.",
      actions: [MY_DRAW_ACTION.viewGame, MY_DRAW_ACTION.submitAvailability],
    });
  });

  it("확정 · 조율형 · 세션 시각이 있으면 확정된 시각을 알린다", () => {
    expect(
      myDrawFooter({
        confirmed: true,
        scheduleMode: SCHEDULE_MODE.coordinate,
        confirmedAt: startsAt,
        sessionEnded: false,
      }),
    ).toEqual({
      hint: "9월 16일 (수) 20:00으로 확정되었습니다.",
      actions: [MY_DRAW_ACTION.viewGame],
    });
  });

  it("확정 · 일시 지정형이면 진행 시각을 알린다", () => {
    expect(
      myDrawFooter({
        confirmed: true,
        scheduleMode: SCHEDULE_MODE.fixed,
        confirmedAt: startsAt,
        sessionEnded: false,
      }).hint,
    ).toBe("9월 16일 (수) 20:00에 진행합니다.");
  });

  it("대기 · 세션 종료 전이면 대기 취소를 둔다", () => {
    expect(
      myDrawFooter({
        confirmed: false,
        scheduleMode: SCHEDULE_MODE.fixed,
        confirmedAt: startsAt,
        sessionEnded: false,
      }),
    ).toEqual({
      hint: "자리가 나면 GM이 대기 명단에서 확정합니다.",
      actions: [MY_DRAW_ACTION.leaveWaitlist, MY_DRAW_ACTION.viewGame],
    });
  });

  it("대기 · 세션 종료 뒤면 구인 글 보기 하나만", () => {
    expect(
      myDrawFooter({
        confirmed: false,
        scheduleMode: SCHEDULE_MODE.fixed,
        confirmedAt: startsAt,
        sessionEnded: true,
      }),
    ).toEqual({ hint: null, actions: [MY_DRAW_ACTION.viewGame] });
  });
});
