import { describe, expect, it } from "vitest";

import { cancelBlockReason } from "./cancel-block-reason";
import { GAME_CANCEL_KIND } from "./game-cancel-kind";
import { storedCancelReason } from "./stored-cancel-reason";

const HOUR = 3_600_000;
const now = new Date("2026-10-03T12:00:00Z");
const at = (hours: number) => new Date(now.getTime() + hours * HOUR);

describe("cancelBlockReason", () => {
  it("이미 취소한 구인은 다시 취소하지 않는다", () => {
    const game = { cancelledAt: at(-1), confirmedAt: at(5) };
    expect(cancelBlockReason({ game, now })).toBe("already_cancelled");
  });

  it("시간이 정해지지 않은 구인은 취소할 수 있다", () => {
    const game = { cancelledAt: null, confirmedAt: null };
    expect(cancelBlockReason({ game, now })).toBeNull();
  });

  it("시작 1분 전에는 취소할 수 있다", () => {
    const game = { cancelledAt: null, confirmedAt: new Date(now.getTime() + 60_000) };
    expect(cancelBlockReason({ game, now })).toBeNull();
  });

  it("진행 중인 세션은 취소하지 않는다", () => {
    const game = { cancelledAt: null, confirmedAt: at(-1) };
    expect(cancelBlockReason({ game, now })).toBe("session_started");
  });

  it("끝난 세션도 시작한 세션으로 보고 취소하지 않는다", () => {
    const game = { cancelledAt: null, confirmedAt: at(-48) };
    expect(cancelBlockReason({ game, now })).toBe("session_started");
  });
});

describe("storedCancelReason", () => {
  it("GM 취소만 사유를 남긴다", () => {
    expect(storedCancelReason({ kind: GAME_CANCEL_KIND.gm, reason: "사정" })).toBe("사정");
    expect(storedCancelReason({ kind: GAME_CANCEL_KIND.staff, reason: "규칙 위반" })).toBeNull();
    expect(storedCancelReason({ kind: GAME_CANCEL_KIND.auto, reason: "탈퇴" })).toBeNull();
  });

  it("빈 사유는 남기지 않는다", () => {
    expect(storedCancelReason({ kind: GAME_CANCEL_KIND.gm, reason: "" })).toBeNull();
  });
});
