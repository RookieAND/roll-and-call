import { describe, expect, it } from "vitest";

import { OTHER_REASON, REJECT_REASONS } from "@/shared/lib";

import { rejectMessage } from "./reject-message";

const prefill = (name: string) =>
  rejectMessage({
    text: REJECT_REASONS.find((reason) => reason.name === name)!.message,
    previousShots: [],
    shots: [],
  });

describe("rejectMessage", () => {
  it("사유를 고르면 그 사유의 문장을 미리 채운다", () => {
    expect(prefill("신청한 판본과 다른 책입니다")).toBe("신청한 판본과 다른 책입니다.");
  });

  it("「기타」는 빈 칸이다", () => {
    expect(prefill(OTHER_REASON)).toBe("");
  });

  it("문제 사진을 지정하면 꼬리 문장이 붙는다", () => {
    expect(
      rejectMessage({
        text: "추가 확인이 필요합니다.",
        previousShots: [],
        shots: ["앞면", "책등"],
      }),
    ).toBe("추가 확인이 필요합니다. 앞면·책등 사진을 다시 찍어 올려 주세요.");
  });

  it("지정을 바꾸거나 풀면 꼬리 문장이 바뀌거나 빠진다", () => {
    const flagged = "추가 확인이 필요합니다. 앞면 사진을 다시 찍어 올려 주세요.";
    expect(rejectMessage({ text: flagged, previousShots: ["앞면"], shots: ["앞면", "뒷면"] })).toBe(
      "추가 확인이 필요합니다. 앞면·뒷면 사진을 다시 찍어 올려 주세요.",
    );
    expect(rejectMessage({ text: flagged, previousShots: ["앞면"], shots: [] })).toBe(
      "추가 확인이 필요합니다.",
    );
  });

  it("빈 칸에 사진만 지정하면 꼬리 문장만 남는다", () => {
    expect(rejectMessage({ text: "", previousShots: [], shots: ["앞면"] })).toBe(
      "앞면 사진을 다시 찍어 올려 주세요.",
    );
  });
});
