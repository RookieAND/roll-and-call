import { describe, expect, it } from "vitest";

import { rejectionSummary } from "./rejection-summary";

describe("rejectionSummary", () => {
  it("태그가 있으면 태그를 쓴다", () => {
    expect(
      rejectionSummary({ rejectTag: "신청한 판본과 다른 책입니다", flaggedShots: ["front"] }),
    ).toBe("신청한 판본과 다른 책입니다");
  });

  it("태그가 없고 문제 사진이 있으면 사진을 다시 올리라고 한다", () => {
    expect(rejectionSummary({ rejectTag: null, flaggedShots: ["front", "side"] })).toBe(
      "앞면·책등 사진을 다시 올려 주세요",
    );
  });

  it("그 밖에는 사유 첫 줄을 쓴다", () => {
    expect(rejectionSummary({ rejectReason: "첫 줄입니다.\n둘째 줄입니다." })).toBe("첫 줄입니다.");
  });

  it("아무것도 없으면 다시 신청하라고 한다", () => {
    expect(rejectionSummary(null)).toBe("다시 신청해 주세요");
    expect(rejectionSummary({ rejectReason: "" })).toBe("다시 신청해 주세요");
  });
});
