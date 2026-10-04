import { GAME_CANCEL_KIND } from "@roll-and-call/database/games/model";
import { describe, expect, it } from "vitest";

import { cancelDescription } from "./cancel-description";

describe("cancelDescription", () => {
  it("GM 취소는 사유를 둘째 줄에 적는다", () => {
    expect(cancelDescription({ kind: GAME_CANCEL_KIND.gm, reason: "GM 사정" })).toBe(
      "GM이 세션을 취소했어요.\n사유: GM 사정",
    );
  });

  it("사유가 없던 옛 GM 취소는 첫 줄만", () => {
    expect(cancelDescription({ kind: GAME_CANCEL_KIND.gm, reason: null })).toBe(
      "GM이 세션을 취소했어요.",
    );
  });

  it("운영진·자동 취소 문구", () => {
    expect(cancelDescription({ kind: GAME_CANCEL_KIND.staff, reason: null })).toBe(
      "운영진이 취소한 구인입니다.",
    );
    expect(cancelDescription({ kind: GAME_CANCEL_KIND.auto, reason: null })).toBe(
      "GM이 디스코드 서버를 나가 취소된 구인입니다.",
    );
  });
});
