import { describe, expect, it } from "vitest";

import { RECRUIT_METHOD } from "@/entities/game";

import { preConfirmedHint } from "./pre-confirmed-hint";

describe("preConfirmedHint", () => {
  it("0명이면 모집 방식과 무관한 안내", () => {
    const hint = "신청을 받지 않고 바로 함께할 사람이 있으면 넣어 주세요.";
    expect(preConfirmedHint({ count: 0, openSeats: 4, method: RECRUIT_METHOD.selection })).toBe(
      hint,
    );
  });

  it("선발은 선발 없이 먼저 확정된다고 안내한다", () => {
    expect(preConfirmedHint({ count: 2, openSeats: 2, method: RECRUIT_METHOD.selection })).toBe(
      "직접 확정한 두 사람은 선발 없이 먼저 확정되고, 남은 2자리를 선발합니다.",
    );
  });

  it("10명을 넘으면 명 표기", () => {
    expect(preConfirmedHint({ count: 11, openSeats: 3, method: RECRUIT_METHOD.selection })).toBe(
      "직접 확정한 11명은 선발 없이 먼저 확정되고, 남은 3자리를 선발합니다.",
    );
  });
});
