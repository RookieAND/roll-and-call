import { GAME_CANCEL_KIND } from "@roll-and-call/database/notifications/model";
import { describe, expect, it } from "vitest";

import { cancelReasonField, cancelTextKey } from "./cancel-description";

describe("cancelTextKey", () => {
  it("취소 종류마다 설명 문장 키가 다르다", () => {
    expect(cancelTextKey(GAME_CANCEL_KIND.gm)).toBe("cancel_gm");
    expect(cancelTextKey(GAME_CANCEL_KIND.staff)).toBe("cancel_staff");
    expect(cancelTextKey(GAME_CANCEL_KIND.auto)).toBe("cancel_auto");
    expect(cancelTextKey(GAME_CANCEL_KIND.minPlayersUnmet)).toBe("cancel_min_players");
    expect(cancelTextKey(null)).toBe("cancel_gm");
  });
});

describe("cancelReasonField", () => {
  it("GM 취소만 사유를 필드로 내보낸다", () => {
    expect(cancelReasonField({ kind: GAME_CANCEL_KIND.gm, reason: "GM 사정" })).toEqual({
      name: "📝 사유",
      value: "GM 사정",
      inline: false,
    });
  });

  it("사유가 없거나 운영진·자동 취소면 필드가 없다", () => {
    expect(cancelReasonField({ kind: GAME_CANCEL_KIND.gm, reason: null })).toBeUndefined();
    expect(cancelReasonField({ kind: GAME_CANCEL_KIND.gm, reason: "  " })).toBeUndefined();
    expect(cancelReasonField({ kind: GAME_CANCEL_KIND.staff, reason: "사유" })).toBeUndefined();
    expect(cancelReasonField({ kind: GAME_CANCEL_KIND.auto, reason: "사유" })).toBeUndefined();
    expect(
      cancelReasonField({ kind: GAME_CANCEL_KIND.minPlayersUnmet, reason: "사유" }),
    ).toBeUndefined();
  });

  it("값은 1024자를 넘기지 않는다", () => {
    const field = cancelReasonField({ kind: GAME_CANCEL_KIND.gm, reason: "가".repeat(2000) });
    expect(field?.value).toHaveLength(1024);
  });
});
