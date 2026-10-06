import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";
import { describe, expect, it } from "vitest";

import { cancelReasonLine, cancelTextKey } from "./cancel-description";

describe("cancelTextKey", () => {
  it("취소 종류마다 설명 문장 키가 다르다", () => {
    expect(cancelTextKey(GAME_CANCEL_KIND.gm)).toBe("cancel_gm");
    expect(cancelTextKey(GAME_CANCEL_KIND.staff)).toBe("cancel_staff");
    expect(cancelTextKey(GAME_CANCEL_KIND.auto)).toBe("cancel_auto");
    expect(cancelTextKey(GAME_CANCEL_KIND.minPlayersUnmet)).toBe("cancel_min_players");
    expect(cancelTextKey(null)).toBe("cancel_gm");
  });
});

describe("cancelReasonLine", () => {
  it("GM 취소만 사유를 둘째 줄에 적는다", () => {
    expect(cancelReasonLine({ kind: GAME_CANCEL_KIND.gm, reason: "GM 사정" })).toBe(
      "\n사유: GM 사정",
    );
  });

  it("사유가 없거나 운영진·자동 취소면 붙이지 않는다", () => {
    expect(cancelReasonLine({ kind: GAME_CANCEL_KIND.gm, reason: null })).toBe("");
    expect(cancelReasonLine({ kind: GAME_CANCEL_KIND.staff, reason: "사유" })).toBe("");
    expect(cancelReasonLine({ kind: GAME_CANCEL_KIND.auto, reason: "사유" })).toBe("");
    expect(cancelReasonLine({ kind: GAME_CANCEL_KIND.minPlayersUnmet, reason: "사유" })).toBe("");
  });
});
