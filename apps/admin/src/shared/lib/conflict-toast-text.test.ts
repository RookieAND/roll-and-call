import { describe, expect, it } from "vitest";

import { conflictToastText } from "./conflict-toast-text";

describe("conflictToastText", () => {
  const conflict = { by: "달빛토끼", at: new Date("2026-09-21T15:05:00Z") };

  it("다른 운영진이면 닉네임과 KST 시각을 쓴다", () => {
    expect(conflictToastText({ conflict, self: false, target: "신청" })).toBe(
      "다른 운영진(달빛토끼)이 00:05에 먼저 처리했습니다",
    );
  });

  it("본인이 처리했으면 이미 처리된 대상이라고 쓴다", () => {
    expect(conflictToastText({ conflict, self: true, target: "구인" })).toBe(
      "이미 처리된 구인입니다",
    );
  });

  it("누가 했는지 모르면 이미 처리된 대상이라고 쓴다", () => {
    expect(conflictToastText({ conflict: null, self: false, target: "후기" })).toBe(
      "이미 처리된 후기입니다",
    );
  });
});
