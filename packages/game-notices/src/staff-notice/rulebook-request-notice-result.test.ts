import { DISCORD_COLOR } from "@roll-and-call/discord";
import { describe, expect, it } from "vitest";

import { rulebookRequestNoticeResult } from "./rulebook-request-notice-result";

describe("rulebookRequestNoticeResult", () => {
  it("추가·연결은 확정 색에 결과와 운영진 칸을 만든다", () => {
    const added = rulebookRequestNoticeResult({ outcome: "added", staffNickname: "노이" });
    expect(added.color).toBe(DISCORD_COLOR.confirmed);
    expect(added.fields.map(({ value }) => value)).toEqual(["✅ 룰북 추가", "노이"]);
    expect(
      rulebookRequestNoticeResult({ outcome: "linked", staffNickname: "노이" }).fields[0]?.value,
    ).toBe("🔗 기존 룰북에 연결");
  });

  it("반려는 취소 색이고 운영진 이름을 모르면 알 수 없음으로 적는다", () => {
    const rejected = rulebookRequestNoticeResult({ outcome: "rejected", staffNickname: null });
    expect(rejected.color).toBe(DISCORD_COLOR.cancelled);
    expect(rejected.fields.map(({ value }) => value)).toEqual(["❌ 반려", "알 수 없음"]);
  });
});
