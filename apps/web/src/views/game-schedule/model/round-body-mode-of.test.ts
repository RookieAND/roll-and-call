import { describe, expect, it } from "vitest";

import { roundBodyModeOf } from "./round-body-mode-of";

describe("roundBodyModeOf", () => {
  it("기간 안 참여자는 칠하기, 아니면 읽기 전용 안내", () => {
    expect(roundBodyModeOf({ isOpen: true, canPaint: true, awaitingResult: null }).kind).toBe(
      "paint",
    );
    expect(roundBodyModeOf({ isOpen: true, canPaint: false, awaitingResult: null })).toMatchObject({
      kind: "closed",
      notice: { lines: ["확정된 참여자만 가능 시간을 입력할 수 있습니다."] },
    });
    expect(roundBodyModeOf({ isOpen: false, canPaint: true, awaitingResult: null })).toMatchObject({
      kind: "closed",
      notice: { lines: ["가능 시간 입력이 끝났습니다."] },
    });
  });
});
