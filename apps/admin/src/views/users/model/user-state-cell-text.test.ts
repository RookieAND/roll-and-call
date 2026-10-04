import { describe, expect, it } from "vitest";

import { userStateCellText } from "./user-state-cell-text";

describe("userStateCellText", () => {
  it("제재 중이면 뱃지와 끝나는 날, 무기한이면 해제될 때까지를 보인다", () => {
    expect(
      userStateCellText({
        membership: "active",
        sanctioned: true,
        sanctionUntil: new Date("2026-10-30T03:00:00Z"),
      }),
    ).toEqual({ badge: "제재 중", text: "2026년 10월 30일까지" });
    expect(
      userStateCellText({ membership: "active", sanctioned: true, sanctionUntil: null }),
    ).toEqual({ badge: "제재 중", text: "해제될 때까지" });
  });

  it("제재 중이 아니면 정상 또는 나감 글자만 보인다", () => {
    expect(
      userStateCellText({ membership: "active", sanctioned: false, sanctionUntil: null }),
    ).toEqual({ badge: null, text: "정상" });
    expect(
      userStateCellText({ membership: "left", sanctioned: false, sanctionUntil: null }),
    ).toEqual({ badge: null, text: "나감" });
  });
});
