import { DISCORD_COLOR } from "@roll-and-call/discord";
import { describe, expect, it } from "vitest";

import { homebrewNoticeResult } from "./homebrew-notice-result";

describe("homebrewNoticeResult", () => {
  it("승인은 확정 색, 반려는 취소 색에 결과와 운영진 칸을 만든다", () => {
    const approved = homebrewNoticeResult({ outcome: "approved", staffNickname: "노이" });
    expect(approved.color).toBe(DISCORD_COLOR.confirmed);
    expect(approved.fields.map(({ value }) => value)).toEqual(["✅ 승인", "노이"]);
    const rejected = homebrewNoticeResult({ outcome: "rejected", staffNickname: null });
    expect(rejected.color).toBe(DISCORD_COLOR.cancelled);
    expect(rejected.fields.map(({ value }) => value)).toEqual(["❌ 반려", "알 수 없음"]);
  });

  it("철회는 처리한 운영진 칸이 없다", () => {
    const withdrawn = homebrewNoticeResult({ outcome: "withdrawn", staffNickname: null });
    expect(withdrawn.fields.map(({ value }) => value)).toEqual(["↩️ 신청자가 철회"]);
  });
});
