import { describe, expect, it } from "vitest";

import { checksWaitingSchedule } from "./checks-waiting-schedule";
import { RECRUIT_METHOD } from "./recruit-method";

describe("checksWaitingSchedule", () => {
  it("추첨 전 추첨 글만 대기 인원을 본다", () => {
    expect(checksWaitingSchedule({ recruitMethod: RECRUIT_METHOD.lottery, drawnAt: null })).toBe(
      true,
    );
    expect(
      checksWaitingSchedule({ recruitMethod: RECRUIT_METHOD.lottery, drawnAt: new Date() }),
    ).toBe(false);
    expect(checksWaitingSchedule({ recruitMethod: RECRUIT_METHOD.firstCome, drawnAt: null })).toBe(
      false,
    );
    expect(checksWaitingSchedule({ recruitMethod: RECRUIT_METHOD.selection, drawnAt: null })).toBe(
      false,
    );
  });
});
