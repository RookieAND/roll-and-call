import { describe, expect, it } from "vitest";

import { gameCancelledRecipients } from "./game-cancelled-recipients";

const game = { gmId: "gm", recruitMethod: "first_come" as const, drawnAt: null };
const roster = [
  { userId: "a", status: "confirmed" as const },
  { userId: "b", status: "waiting" as const },
  { userId: "c", status: "removed" as const },
];

describe("gameCancelledRecipients", () => {
  it("GM 취소는 확정자·대기자만 받고 내보낸 사람은 받지 않는다", () => {
    expect(gameCancelledRecipients({ game, kind: "gm", roster })).toEqual(["a", "b"]);
  });

  it("운영진·자동 취소는 GM도 받는다", () => {
    expect(gameCancelledRecipients({ game, kind: "staff", roster })).toEqual(["a", "b", "gm"]);
    expect(gameCancelledRecipients({ game, kind: "auto", roster })).toEqual(["a", "b", "gm"]);
  });

  it("추첨 글 추첨 전이면 신청자(대기)는 빼고 확정자는 받는다", () => {
    const lottery = { ...game, recruitMethod: "lottery" as const };
    expect(gameCancelledRecipients({ game: lottery, kind: "gm", roster })).toEqual(["a"]);
  });

  it("추첨 글 추첨 뒤면 대기자도 받는다", () => {
    const drawn = { ...game, recruitMethod: "lottery" as const, drawnAt: new Date() };
    expect(gameCancelledRecipients({ game: drawn, kind: "gm", roster })).toEqual(["a", "b"]);
  });

  it("같은 사람은 한 번만 받는다", () => {
    const duplicated = [...roster, { userId: "gm", status: "confirmed" as const }];
    expect(gameCancelledRecipients({ game, kind: "staff", roster: duplicated })).toEqual([
      "a",
      "b",
      "gm",
    ]);
  });
});
