import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD, SCHEDULE_MODE } from "@/entities/game";
import { GAME_NOT_FOUND_RESULT } from "@/shared/api";

import { confirmBlockReason } from "./confirm-block-reason";

const GM = "gm";
const now = new Date("2026-09-15T03:00:00Z");
type LockedGame = NonNullable<Parameters<typeof confirmBlockReason>[0]["game"]>;

const game: LockedGame = {
  cancelledAt: null,
  gmId: GM,
  scheduleMode: SCHEDULE_MODE.coordinate,
  recruitMethod: RECRUIT_METHOD.lottery,
  drawnAt: new Date("2026-09-14T00:00:00Z"),
  confirmedAt: null,
  rangeStart: "2026-09-16",
  rangeEnd: "2026-09-19",
  windowStartHour: 22,
  windowEndHour: 2,
};
const inRange = new Date("2026-09-17T22:00:00+09:00");

function reason(overrides: Partial<LockedGame> | null, startsAt = inRange) {
  return confirmBlockReason(
    { game: overrides ? { ...game, ...overrides } : game, userId: GM, startsAt },
    now,
  )?.error;
}

describe("confirmBlockReason", () => {
  it("조건이 맞으면 통과한다", () => {
    expect(reason(null)).toBeUndefined();
  });

  it("없는 구인은 화면 에러다", () => {
    expect(confirmBlockReason({ game: undefined, userId: GM, startsAt: inRange }, now)).toBe(
      GAME_NOT_FOUND_RESULT,
    );
  });

  it("GM이 아니면 막는다", () => {
    expect(confirmBlockReason({ game, userId: "other", startsAt: inRange }, now)?.error).toBe(
      "확정 권한이 없습니다.",
    );
  });

  it("추첨 전이면 막는다", () => {
    expect(reason({ drawnAt: null })).toBe("추첨 뒤에 세션 시간을 정할 수 있습니다.");
  });

  it("시작한 세션은 바꿀 수 없고, 시작 1분 전에는 바꿀 수 있다", () => {
    expect(reason({ confirmedAt: new Date(now.getTime() - 60_000) })).toBe(
      "시작한 세션은 시간을 바꿀 수 없습니다.",
    );
    expect(reason({ confirmedAt: new Date(now.getTime() + 60_000) })).toBeUndefined();
  });

  it("지난 시각은 막는다", () => {
    expect(reason(null, new Date(now.getTime() - 60_000))).toBe(
      "지난 시각으로는 정할 수 없습니다.",
    );
  });

  it("조율 기간 밖 날짜는 막고, 시간대 밖 시각은 통과한다", () => {
    expect(reason(null, new Date("2026-09-20T22:00:00+09:00"))).toBe(
      "조율 기간 안의 날짜를 골라 주세요.",
    );
    expect(reason(null, new Date("2026-09-17T09:00:00+09:00"))).toBeUndefined();
    expect(reason({ rangeStart: null, rangeEnd: null })).toBe("조율 기간 안의 날짜를 골라 주세요.");
  });

  it("일시 지정형은 조율 대상이 아니다", () => {
    expect(reason({ scheduleMode: SCHEDULE_MODE.fixed })).toBe(
      "일시가 지정된 구인은 조율 대상이 아닙니다.",
    );
  });
});
