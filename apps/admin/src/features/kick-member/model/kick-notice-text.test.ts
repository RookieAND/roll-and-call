import { describe, expect, it } from "vitest";

import { kickNoticeText } from "./kick-notice-text";

describe("kickNoticeText", () => {
  it("사유를 고르기 전에는 첫 줄만, 고르면 마침표 없는 사유 줄을 붙인다", () => {
    expect(kickNoticeText({ serverName: "TRPIA", reason: "" })).toBe(
      "TRPIA 서버에서 추방되었습니다.",
    );
    expect(kickNoticeText({ serverName: "TRPIA", reason: "욕설·비방." })).toBe(
      "TRPIA 서버에서 추방되었습니다.\n사유: 욕설·비방",
    );
  });
});
