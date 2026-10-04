import { describe, expect, it } from "vitest";

import { decisionToastText } from "./decision-toast-text";

const at = new Date("2026-10-05T05:36:00Z");
const conflict = (status: "approved" | "rejected" | "withdrawn", byId: string) => ({
  ok: false as const,
  conflict: { status, by: "달빛토끼", byId, at },
});

describe("decisionToastText", () => {
  it("다른 운영진이 먼저 처리했으면 누가 언제 했는지 알린다", () => {
    expect(decisionToastText({ failure: conflict("approved", "other"), viewerId: "me" })).toBe(
      "다른 운영진(달빛토끼)이 14:36에 먼저 처리했습니다",
    );
  });

  it("내가 이미 처리했으면 무엇을 했는지 알린다", () => {
    expect(decisionToastText({ failure: conflict("rejected", "me"), viewerId: "me" })).toBe(
      "이미 반려한 신청입니다",
    );
  });

  it("거둔 신청은 토스트 없이 화면 안내로 보인다", () => {
    expect(
      decisionToastText({ failure: conflict("withdrawn", "user"), viewerId: "me" }),
    ).toBeNull();
  });
});
